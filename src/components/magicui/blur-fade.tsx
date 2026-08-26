"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: Variants;
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string;
  blur?: string;
}

const BlurFade = ({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = false,
  inViewMargin = "-50px",
  blur = "6px",
}: BlurFadeProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const inViewResult = useInView(ref, { once: true, margin: inViewMargin as any });
  const isInView = !inView || inViewResult;

  const defaultVariants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: 0, opacity: 1, filter: "blur(0px)" },
  };

  const combinedVariants = variant ?? defaultVariants;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={combinedVariants}
      transition={{ delay: 0.04 + delay, duration, ease: "easeOut" }}
      // Framer leaves `filter: blur(0px)` inline once the animation settles, and any
      // filter other than `none` keeps the element on its own composited layer, so it
      // repaints on every scroll frame. The home page wraps each experience row, each
      // education row and each achievement in one of these, so that was forty-odd
      // permanently promoted layers and the flicker they caused. Clearing the property
      // once the animation is done drops the layer and the flicker with it.
      onAnimationComplete={() => {
        const el = ref.current;
        if (el) {
          el.style.filter = "";
          el.style.willChange = "auto";
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default BlurFade;
