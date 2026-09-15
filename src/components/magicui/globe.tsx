"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

// Magic UI's Globe, changed in three ways: one marker, on Jakarta; black and white in both
// themes; and no WebGL context for a copy the layout has hidden.

const MOVEMENT_DAMPING = 1400;

const JAKARTA: [number, number] = [-6.2088, 106.8456];

// cobe turns the globe by phi. Starting at this angle puts Jakarta in front of the reader
// before the rotation carries it round.
const JAKARTA_PHI = Math.PI - ((JAKARTA[1] * Math.PI) / 180 - Math.PI / 2);

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
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
  markers: [{ location: JAKARTA, size: 0.08 }],
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
}: {
  className?: string;
  config?: COBEOptions;
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
        onRender: (state) => {
          if (!pointerInteracting.current) phiRef.current += 0.005;
          state.phi = phiRef.current + rs.get();
          state.width = widthRef.current * 2;
          state.height = widthRef.current * 2;
        },
      });

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
      globe?.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [rs, config, dark]);

  return (
    <div
      className={cn("absolute inset-0 mx-auto aspect-square w-full max-w-[600px]", className)}
    >
      <canvas
        className="size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
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
    </div>
  );
}
