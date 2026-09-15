import { type ComponentPropsWithoutRef } from "react"

// Magic UI's Marquee. Classes are joined by hand, since this site has no tailwind-merge, so the
// default duration and gap step aside when the caller passes its own instead of both applying.

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number
}

export function Marquee({
  className = "",
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  const defaults = [
    className.includes("[--duration:") ? "" : "[--duration:40s]",
    className.includes("[--gap:") ? "" : "[--gap:1rem]",
  ].join(" ")

  return (
    <div
      {...props}
      className={`group flex gap-(--gap) overflow-hidden p-2 ${defaults} ${vertical ? "flex-col" : "flex-row"} ${className}`}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            aria-hidden={i > 0}
            className={[
              "flex shrink-0 justify-around gap-(--gap)",
              vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row",
              pauseOnHover ? "group-hover:[animation-play-state:paused]" : "",
              reverse ? "[animation-direction:reverse]" : "",
            ].join(" ")}
          >
            {children}
          </div>
        ))}
    </div>
  )
}
