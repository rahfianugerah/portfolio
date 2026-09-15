"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import createGlobe, { type COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

// Magic UI's Globe, changed in five ways: one marker, on Jakarta; black and white in both
// themes; no WebGL context until the canvas has a width; cobe 2's update() in place of the
// render callback cobe 0.6 took; and a beacon with a tooltip pinned to the marker.

const MOVEMENT_DAMPING = 1400;

const JAKARTA: [number, number] = [-6.2088, 106.8456];

// cobe turns the globe by phi. Starting at this angle puts Jakarta in front of the reader
// before the rotation carries it round.
const JAKARTA_PHI = Math.PI - ((JAKARTA[1] * Math.PI) / 180 - Math.PI / 2);

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: JAKARTA_PHI,
  theta: 0.2,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [0.04, 0.04, 0.04],
  glowColor: [1, 1, 1],
  // The id makes cobe publish the marker as the CSS anchor --cobe-jakarta, which the beacon uses.
  markers: [{ location: JAKARTA, size: 0.08, id: "jakarta" }],
};

// On a dark page the land lightens and the marker turns white, or both vanish into the sphere.
const DARK_CONFIG: Partial<COBEOptions> = {
  dark: 1,
  diffuse: 1.2,
  mapBrightness: 6,
  baseColor: [0.3, 0.3, 0.3],
  markerColor: [1, 1, 1],
  glowColor: [0.15, 0.15, 0.15],
};

export function Globe({
  className,
  config = GLOBE_CONFIG,
  avatar = null,
  initials = "",
}: {
  className?: string;
  config?: COBEOptions;
  /** The profile image the beacon's tooltip shows, or null to show the initials instead. */
  avatar?: string | null;
  initials?: string;
}) {
  const dark = useTheme().resolvedTheme === "dark";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(config.phi);
  const widthRef = useRef(0);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    let globe: ReturnType<typeof createGlobe> | null = null;
    let frame = 0;

    // Each frame turns the globe a little, adds whatever the drag has moved it, and keeps the
    // drawing size in step with the canvas.
    const render = () => {
      if (!pointerInteracting.current) phiRef.current += 0.005;
      globe?.update({
        phi: phiRef.current + rs.get(),
        width: widthRef.current * 2,
        height: widthRef.current * 2,
      });
      frame = requestAnimationFrame(render);
    };

    // The layout renders a widget once per breakpoint and hides the others, so a hidden copy
    // has no width. It starts only once it has one, on load or when a resize reveals it.
    const start = () => {
      const canvas = canvasRef.current;
      if (globe || !canvas || !canvas.offsetWidth) return;

      globe = createGlobe(canvas, {
        ...config,
        ...(dark ? DARK_CONFIG : {}),
        width: widthRef.current * 2,
        height: widthRef.current * 2,
      });
      frame = requestAnimationFrame(render);

      setTimeout(() => (canvas.style.opacity = "1"), 0);
    };

    const onResize = () => {
      if (canvasRef.current) {
        widthRef.current = canvasRef.current.offsetWidth;
      }
      start();
    };

    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      cancelAnimationFrame(frame);
      globe?.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [rs, config, dark]);

  return (
    <div
      className={cn("absolute inset-0 mx-auto aspect-square w-full max-w-[600px]", className)}
    >
      <canvas
        className="size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size]"
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
      />

      {/* Pinned to the Jakarta marker, and shown only while it faces the reader: globals.css. */}
      <div className="globe-beacon">
        <span className="absolute -left-3 -top-3 size-6 animate-ping rounded-full bg-foreground/40" />
        <span className="absolute -left-1.5 -top-1.5 size-3 rounded-full border-2 border-background bg-foreground" />
        <div className="absolute bottom-4 left-0 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-border bg-popover py-1 pl-1 pr-3 text-xs font-medium text-popover-foreground shadow-lg">
          {avatar ? (
            <Image src={avatar} alt="" width={24} height={24} className="size-6 rounded-full object-cover" />
          ) : (
            <span className="grid size-6 place-items-center rounded-full bg-foreground text-[10px] font-bold text-background">
              {initials}
            </span>
          )}
          I&apos;m right here!
        </div>
      </div>
    </div>
  );
}
