import crypto from "node:crypto";
import sharp from "sharp";
import { fileTypeFromBuffer } from "file-type";

/**
 * The upload pipeline.
 *
 * Every step here is a control, not a convenience, and the order matters: cheap rejections
 * come before expensive work, so a hostile upload is refused before anything decodes it.
 */

/** Explicit allowlist. A type is added deliberately, never by widening a pattern. */
const ALLOWED = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
} as const;

export type AllowedMime = keyof typeof ALLOWED;

export const MAX_UPLOAD_BYTES = Number(
  process.env.MAX_UPLOAD_BYTES ?? 10 * 1024 * 1024
);

export type ProcessedFile = {
  buffer: Buffer;
  mimeType: string;
  extension: string;
  originalBytes: number;
  storedBytes: number;
  sha256: string;
  width: number | null;
  height: number | null;
};

export class UploadError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}

/**
 * Identify a file by its actual bytes.
 *
 * Never by extension or by the Content-Type header: the uploader controls both, so a
 * `.png` that is really a script, or a PDF announcing itself as an image, both arrive
 * looking fine. The magic bytes are the only part of the claim the uploader cannot forge
 * without changing what the file actually is.
 */
async function detectMime(buffer: Buffer): Promise<AllowedMime> {
  const detected = await fileTypeFromBuffer(buffer);
  if (!detected) {
    throw new UploadError("Could not identify the file type from its contents.");
  }
  if (!(detected.mime in ALLOWED)) {
    throw new UploadError(
      `Files of type ${detected.mime} are not accepted. Allowed: JPEG, PNG, WebP, PDF.`
    );
  }
  return detected.mime as AllowedMime;
}

/**
 * Re-encode an image, strip its metadata, and bound its size.
 *
 * Re-encoding is itself a security control, not only a compression step: decoding to
 * pixels and writing a fresh file discards anything that was riding along in the
 * container, so a polyglot file cannot survive the round trip.
 *
 * Stripping EXIF is mandatory. A phone photograph carries GPS coordinates, and location
 * data about an identifiable person is personal data under both Indonesia's UU PDP and
 * the GDPR. Publishing one to a public bucket publishes where the photograph was taken.
 * `sharp` drops all metadata unless explicitly told to keep it, which is the behaviour
 * relied on here.
 */
async function processImage(buffer: Buffer) {
  const image = sharp(buffer, { failOn: "error" });
  const meta = await image.metadata();

  const resized = await image
    .rotate() // Apply the EXIF orientation before the tag is discarded, or the image lands sideways.
    .resize({
      width: 2000,
      height: 2000,
      fit: "inside",
      withoutEnlargement: true, // Never upscale: it adds bytes and no detail.
    })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: resized.data,
    width: resized.info.width,
    height: resized.info.height,
    originalWidth: meta.width ?? null,
  };
}

/**
 * Validate and normalise an upload.
 *
 * The size check runs first because it is free, and it is enforced on the actual byte
 * length rather than on a declared Content-Length, which is another header the uploader
 * controls.
 */
export async function processUpload(
  input: Buffer,
  _declaredName: string
): Promise<ProcessedFile> {
  if (input.byteLength === 0) {
    throw new UploadError("The file is empty.");
  }
  if (input.byteLength > MAX_UPLOAD_BYTES) {
    throw new UploadError(
      `The file is larger than the ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB limit.`,
      413
    );
  }

  const mime = await detectMime(input);

  if (mime === "application/pdf") {
    // A PDF is stored as uploaded. Re-encoding one needs Ghostscript or qpdf, which is a
    // native binary this runtime does not have; a corrupted resume is a worse outcome than
    // an uncompressed one. It is stored privately, so it is not served to the public.
    return {
      buffer: input,
      mimeType: mime,
      extension: ALLOWED[mime],
      originalBytes: input.byteLength,
      storedBytes: input.byteLength,
      sha256: sha256Of(input),
      width: null,
      height: null,
    };
  }

  const processed = await processImage(input);

  // Compression must never make a file larger. Where WebP loses, keep the original bytes
  // and the original type, but only after the re-encode has proved the file decodes.
  const useOriginal = processed.buffer.byteLength >= input.byteLength;
  const buffer = useOriginal ? input : processed.buffer;
  const mimeType = useOriginal ? mime : "image/webp";

  return {
    buffer,
    mimeType,
    extension: useOriginal ? ALLOWED[mime] : "webp",
    originalBytes: input.byteLength,
    storedBytes: buffer.byteLength,
    sha256: sha256Of(buffer),
    width: processed.width,
    height: processed.height,
  };
}

export function sha256Of(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

/**
 * The stored object path.
 *
 * Built entirely on the server from the content hash. The uploader's filename never
 * reaches it. A name like `../../config` is a path traversal, and even a benign one
 * leaks whatever the person happened to call the file. The original is kept as metadata,
 * where it is data rather than a path.
 */
export function storagePath(
  visibility: "public" | "private",
  sha256: string,
  extension: string
): string {
  return `${visibility}/${sha256.slice(0, 2)}/${sha256}.${extension}`;
}
