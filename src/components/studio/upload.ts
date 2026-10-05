import { api, type StoredFile, type UploadTarget } from "./api";

export const UPLOAD_ACCEPT =
  "image/png,image/jpeg,image/webp,image/gif,image/avif,application/pdf,text/markdown,.md";

function contentTypeOf(file: File): string {
  // Browsers disagree on Markdown: some report text/markdown, some text/plain, some nothing.
  return /\.(md|markdown)$/i.test(file.name) ? "text/markdown" : file.type;
}

/** fetch cannot report upload progress, so the bytes go through XMLHttpRequest. */
function sendBytes(
  target: UploadTarget,
  file: File,
  contentType: string,
  onProgress: (fraction: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open(target.method, target.url);

    const headers = { ...target.headers };
    const namesContentType = Object.keys(headers).some((name) => name.toLowerCase() === "content-type");
    // A signed URL covers the declared type, and the browser would otherwise send the file's own.
    if (!namesContentType) headers["Content-Type"] = contentType;
    for (const [name, value] of Object.entries(headers)) request.setRequestHeader(name, value);

    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) resolve();
      else reject(new Error(`The bucket refused the upload (${request.status}).`));
    };
    request.onerror = () => reject(new Error("The upload did not reach the bucket."));
    request.send(file);
  });
}

/** Signs, sends and finalizes one file. Throws with a sentence a person can read. */
export async function uploadFile(
  file: File,
  path: string,
  onProgress: (fraction: number) => void,
): Promise<StoredFile> {
  const contentType = contentTypeOf(file);
  const target = await api<UploadTarget>("/files/upload-url", {
    body: { path, contentType, size: file.size },
  });
  await sendBytes(target, file, contentType, onProgress);
  return api<StoredFile>("/files/finalize", { body: { path } });
}
