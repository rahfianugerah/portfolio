"use client"

import { useEffect, useRef, useState } from "react"

import { getHexSpacing, hexCenter, hexPoints, HexagonPattern } from "./hexagon-pattern"

type Cell = { col: number; row: number; key: string; born: number }

// How long a lit cell takes to go dark once the pointer has left it.
const FADE_MS = 900

/** The flat-top cell whose centre is nearest a point, on the same grid the pattern draws. */
function cellAt(x: number, y: number, radius: number) {
  const { colStep, rowStep } = getHexSpacing(radius, "horizontal", 0)
  const approxCol = Math.floor(x / colStep)
  let best = { col: 0, row: 0, distance: Infinity }

  for (let col = approxCol - 1; col <= approxCol + 1; col++) {
    const offset = col % 2 !== 0 ? rowStep / 2 : 0
    const approxRow = Math.floor((y - offset) / rowStep)
    for (let row = approxRow - 1; row <= approxRow + 1; row++) {
      const [cx, cy] = hexCenter(col, row, radius, "horizontal", 0)
      const distance = (cx - x) ** 2 + (cy - y) ** 2
      if (distance < best.distance) best = { col, row, distance }
    }
  }

  return { col: best.col, row: best.row, key: `${best.col}:${best.row}` }
}

/**
 * Magic UI's Hexagon Pattern, made to follow the pointer.
 *
 * The cell under the cursor lights up and a short trail fades out behind it, and the whole field
 * drifts a few pixels toward the pointer, so the background answers the hand without competing
 * with the words over it. It listens on the window rather than on itself, because the content
 * laid over it takes the pointer events, and it ignores movement outside its own box.
 *
 * Decoration only: hidden from assistive technology, and still under reduced motion.
 */
export function InteractiveHexagonPattern({
  radius = 32,
  trailLength = 14,
  className = "",
}: {
  radius?: number
  trailLength?: number
  className?: string
}) {
  const fieldRef = useRef<SVGSVGElement>(null)
  const frameRef = useRef(0)
  const [trail, setTrail] = useState<Cell[]>([])
  const [shift, setShift] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let prune: ReturnType<typeof setTimeout> | null = null

    const onMove = (event: PointerEvent) => {
      const field = fieldRef.current
      if (!field || reducedMotion.matches) return

      const rect = field.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return

      cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(() => {
        const now = performance.now()
        // The pattern is drawn from -1, -1, so the pointer is moved onto the same origin.
        const cell = cellAt(x + 1, y + 1, radius)

        setTrail((current) =>
          current[0]?.key === cell.key
            ? current
            : [{ ...cell, born: now }, ...current.filter((one) => one.key !== cell.key)].slice(
                0,
                trailLength
              )
        )
        setShift({ x: (x / rect.width - 0.5) * 16, y: (y / rect.height - 0.5) * 16 })

        if (prune) clearTimeout(prune)
        prune = setTimeout(() => {
          const cutoff = performance.now() - FADE_MS
          setTrail((current) => current.filter((one) => one.born > cutoff))
        }, FADE_MS)
      })
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(frameRef.current)
      if (prune) clearTimeout(prune)
    }
  }, [radius, trailLength])

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute -inset-4 transition-transform duration-700 ease-out"
        style={{ transform: `translate3d(${shift.x}px, ${shift.y}px, 0)` }}
      >
        <HexagonPattern radius={radius} className="fill-transparent stroke-foreground/10" />
        <svg ref={fieldRef} className="absolute inset-0 h-full w-full">
          {trail.map((cell, i) => {
            const [cx, cy] = hexCenter(cell.col, cell.row, radius, "horizontal", 0)
            return (
              <polygon
                key={cell.key}
                points={hexPoints(cx - 1, cy - 1, radius - 1, "horizontal")}
                className="fill-foreground stroke-none transition-opacity duration-700"
                style={{ opacity: 0.16 * (1 - i / trailLength) }}
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}
