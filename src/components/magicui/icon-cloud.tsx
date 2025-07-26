"use client";

import React, { useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";

interface Icon {
  x: number;
  y: number;
  z: number;
  id: number;
}

interface IconCloudProps {
  icons?: React.ReactNode[];
  images?: string[];
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function IconCloud({ icons, images }: IconCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [iconPositions, setIconPositions] = useState<Icon[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetRotation, setTargetRotation] = useState<{
    x: number;
    y: number;
    startX: number;
    startY: number;
    distance: number;
    startTime: number;
    duration: number;
  } | null>(null);

  const rotationRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const iconCanvasesRef = useRef<HTMLCanvasElement[]>([]);
  const imagesLoadedRef = useRef<boolean[]>([]);

  // 1) Prepare offscreen canvases (no circle clipping), with fallback
  useEffect(() => {
    const isFallback = !icons && !images;
    const rawItems = icons || images || [];
    const items = isFallback ? new Array(20).fill(null) : rawItems;
    imagesLoadedRef.current = new Array(items.length).fill(false);

    const canvases = items.map((item, idx) => {
      const off = document.createElement("canvas");
      off.width = 40;
      off.height = 40;
      const ctx = off.getContext("2d");
      if (!ctx) return off;

      if (isFallback) {
        // simple placeholder square
        ctx.fillStyle = "#cccccc";
        ctx.fillRect(4, 4, 32, 32);
        imagesLoadedRef.current[idx] = true;
      } else if (images) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = item as string;
        img.onload = () => {
          ctx.clearRect(0, 0, 40, 40);
          ctx.drawImage(img, 0, 0, 40, 40);
          imagesLoadedRef.current[idx] = true;
        };
      } else {
        const svgStr = renderToString(item as React.ReactElement);
        const img = new Image();
        img.src = "data:image/svg+xml;base64," + btoa(svgStr);
        img.onload = () => {
          ctx.clearRect(0, 0, 40, 40);
          ctx.scale(0.4, 0.4);
          ctx.drawImage(img, 0, 0);
          imagesLoadedRef.current[idx] = true;
        };
      }

      return off;
    });

    iconCanvasesRef.current = canvases;
  }, [icons, images]);

  // 2) Fibonacci‑sphere layout
  useEffect(() => {
    const isFallback = !icons && !images;
    const rawItems = icons || images || [];
    const items = isFallback ? new Array(20).fill(null) : rawItems;

    const N = items.length || 20;
    const offset = 2 / N;
    const inc = Math.PI * (3 - Math.sqrt(5));
    const arr: Icon[] = [];

    for (let i = 0; i < N; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * inc;
      arr.push({
        x: Math.cos(phi) * r * 100,
        y: y * 100,
        z: Math.sin(phi) * r * 100,
        id: i,
      });
    }
    setIconPositions(arr);
  }, [icons, images]);

  // 3) Mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // click-to-center logic
    for (const icon of iconPositions) {
      const { x, y, z } = icon;
      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);
      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);

      const rx = x * cosY - z * sinY;
      const rz = x * sinY + z * cosY;
      const ry = y * cosX + rz * sinX;
      const screenX = canvas.width / 2 + rx;
      const screenY = canvas.height / 2 + ry;
      const scale = (rz + 200) / 300;
      const r = 20 * scale;
      const dx = mx - screenX,
        dy = my - screenY;
      if (dx * dx + dy * dy < r * r) {
        const tx = -Math.atan2(icon.y, Math.hypot(icon.x, icon.z));
        const ty = Math.atan2(icon.x, icon.z);
        const cur = rotationRef.current;
        const dist = Math.hypot(tx - cur.x, ty - cur.y);
        const dur = Math.min(2000, Math.max(800, dist * 1000));
        setTargetRotation({
          x: tx,
          y: ty,
          startX: cur.x,
          startY: cur.y,
          distance: dist,
          startTime: performance.now(),
          duration: dur,
        });
        return;
      }
    }

    // start dragging
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    if (isDragging) {
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      rotationRef.current = {
        x: rotationRef.current.x + dy * 0.002,
        y: rotationRef.current.y + dx * 0.002,
      };
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 4) Render & animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2,
        cy = canvas.height / 2;
      const maxD = Math.hypot(cx, cy);
      const dx = mousePos.x - cx,
        dy = mousePos.y - cy;
      const dist = Math.hypot(dx, dy);
      const speed = 0.003 + (dist / maxD) * 0.01;

      if (targetRotation) {
        const elapsed = performance.now() - targetRotation.startTime;
        const t = Math.min(1, elapsed / targetRotation.duration);
        const e = easeOutCubic(t);
        rotationRef.current = {
          x:
            targetRotation.startX +
            (targetRotation.x - targetRotation.startX) * e,
          y:
            targetRotation.startY +
            (targetRotation.y - targetRotation.startY) * e,
        };
        if (t >= 1) setTargetRotation(null);
      } else if (!isDragging) {
        rotationRef.current = {
          x: rotationRef.current.x + (dy / canvas.height) * speed,
          y: rotationRef.current.y + (dx / canvas.width) * speed,
        };
      }

      iconPositions.forEach((icon, i) => {
        const { x, y, z } = icon;
        const cosX = Math.cos(rotationRef.current.x);
        const sinX = Math.sin(rotationRef.current.x);
        const cosY = Math.cos(rotationRef.current.y);
        const sinY = Math.sin(rotationRef.current.y);

        const rx = x * cosY - z * sinY;
        const rz = x * sinY + z * cosY;
        const ry = y * cosX + rz * sinX;
        const scale = (rz + 200) / 300;
        const alpha = Math.max(0.2, Math.min(1, (rz + 150) / 200));

        ctx.save();
        ctx.translate(cx + rx, cy + ry);
        ctx.scale(scale, scale);
        ctx.globalAlpha = alpha;

        const off = iconCanvasesRef.current[i];
        if (off && imagesLoadedRef.current[i]) {
          ctx.drawImage(off, -20, -20, 40, 40);
        }

        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameRef.current!);
  }, [iconPositions, isDragging, mousePos, targetRotation]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      aria-label="Interactive 3D Icon Cloud"
      role="img"
    />
  );
}
