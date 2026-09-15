"use client"

import {
  Children,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type RefAttributes,
} from "react"
import {
  motion,
  useInView,
  type DOMMotionComponents,
  type HTMLMotionProps,
  type MotionProps,
} from "framer-motion"

// Magic UI's Terminal, changed in five ways: classes are joined by hand; the window dots are
// grey rather than red, amber, and green; whether a line has started is derived from the
// sequence instead of being copied into state from an effect, which React 19's lint rules reject;
// onComplete reports the last line finishing, which the site intro waits on; and the body takes
// its side padding back from the site's code block rule, which strips a pre's with !important.

interface SequenceContextValue {
  completeItem: (index: number) => void
  activeIndex: number
  sequenceStarted: boolean
}

const SequenceContext = createContext<SequenceContextValue | null>(null)

const useSequence = () => useContext(SequenceContext)

const ItemIndexContext = createContext<number | null>(null)
const useItemIndex = () => useContext(ItemIndexContext)

const motionElements = {
  article: motion.article,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span,
} as const

type MotionElementType = Extract<
  keyof DOMMotionComponents,
  keyof typeof motionElements
>
type TerminalTypingMotionComponent = ComponentType<
  Omit<HTMLMotionProps<"span">, "ref"> & RefAttributes<HTMLElement>
>

/** Whether this line's turn in the sequence has come. Once it has, it stays true. */
function useTurn(
  sequence: SequenceContextValue | null,
  itemIndex: number | null
) {
  return (
    sequence !== null &&
    itemIndex !== null &&
    sequence.sequenceStarted &&
    sequence.activeIndex >= itemIndex
  )
}

interface AnimatedSpanProps extends MotionProps {
  children: React.ReactNode
  delay?: number
  className?: string
  startOnView?: boolean
}

export const AnimatedSpan = ({
  children,
  delay = 0,
  className = "",
  startOnView = false,
  ...props
}: AnimatedSpanProps) => {
  const elementRef = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(elementRef as React.RefObject<Element>, {
    amount: 0.3,
    once: true,
  })

  const sequence = useSequence()
  const itemIndex = useItemIndex()
  const hasStarted = useTurn(sequence, itemIndex)

  const shouldAnimate = sequence ? hasStarted : startOnView ? isInView : true

  return (
    <motion.div
      ref={elementRef}
      initial={{ opacity: 0, y: -5 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
      transition={{ duration: 0.3, delay: sequence ? 0 : delay / 1000 }}
      className={`grid text-sm font-normal tracking-tight ${className}`}
      onAnimationComplete={() => {
        // Only a line that has actually appeared may hand the turn on.
        if (!sequence || itemIndex === null || !shouldAnimate) return
        sequence.completeItem(itemIndex)
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface TypingAnimationProps extends Omit<MotionProps, "children"> {
  children: string
  className?: string
  duration?: number
  delay?: number
  as?: MotionElementType
  startOnView?: boolean
}

export const TypingAnimation = ({
  children,
  className = "",
  duration = 60,
  delay = 0,
  as: Component = "span",
  startOnView = true,
  ...props
}: TypingAnimationProps) => {
  const MotionComponent = motionElements[
    Component
  ] as TerminalTypingMotionComponent

  const [displayedText, setDisplayedText] = useState<string>("")
  const [delayElapsed, setDelayElapsed] = useState(false)
  const elementRef = useRef<HTMLElement | null>(null)
  const isInView = useInView(elementRef as React.RefObject<Element>, {
    amount: 0.3,
    once: true,
  })

  const sequence = useSequence()
  const itemIndex = useItemIndex()
  const inSequence = sequence !== null && itemIndex !== null
  const turn = useTurn(sequence, itemIndex)

  const completeItemRef = useRef<SequenceContextValue["completeItem"] | null>(null)
  const itemIndexRef = useRef<number | null>(null)

  useEffect(() => {
    completeItemRef.current = sequence?.completeItem ?? null
    itemIndexRef.current = itemIndex
  }, [sequence?.completeItem, itemIndex])

  // Outside a sequence a line starts on its own, after its delay, once it is in view.
  const standaloneReady = !startOnView || isInView
  useEffect(() => {
    if (inSequence || !standaloneReady) return
    const timer = setTimeout(() => setDelayElapsed(true), delay)
    return () => clearTimeout(timer)
  }, [inSequence, standaloneReady, delay])

  const started = inSequence ? turn : delayElapsed

  useEffect(() => {
    if (!started) return

    let i = 0
    const typing = setInterval(() => {
      if (i < children.length) {
        setDisplayedText(children.substring(0, i + 1))
        i++
        return
      }
      clearInterval(typing)
      const completeItem = completeItemRef.current
      const index = itemIndexRef.current
      if (completeItem && index !== null) completeItem(index)
    }, duration)

    return () => clearInterval(typing)
  }, [children, duration, started])

  return (
    <MotionComponent
      ref={elementRef}
      className={`text-sm font-normal tracking-tight ${className}`}
      {...props}
    >
      {displayedText}
    </MotionComponent>
  )
}

interface TerminalProps {
  children: React.ReactNode
  className?: string
  sequence?: boolean
  startOnView?: boolean
  /** Called once, when the last line of the sequence has finished. */
  onComplete?: () => void
}

export const Terminal = ({
  children,
  className = "",
  sequence = true,
  startOnView = true,
  onComplete,
}: TerminalProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(containerRef as React.RefObject<Element>, {
    amount: 0.3,
    once: true,
  })

  const [activeIndex, setActiveIndex] = useState(0)
  const sequenceHasStarted = sequence ? !startOnView || isInView : false

  const contextValue = useMemo<SequenceContextValue | null>(() => {
    if (!sequence) return null
    return {
      completeItem: (index: number) => {
        setActiveIndex((current) => (index === current ? current + 1 : current))
      },
      activeIndex,
      sequenceStarted: sequenceHasStarted,
    }
  }, [sequence, activeIndex, sequenceHasStarted])

  const wrappedChildren = useMemo(() => {
    if (!sequence) return children
    const array = Children.toArray(children)
    return array.map((child, index) => (
      <ItemIndexContext.Provider key={index} value={index}>
        {child as React.ReactNode}
      </ItemIndexContext.Provider>
    ))
  }, [children, sequence])

  // The last line finishing moves the turn past the end, which is when the sequence is done.
  const done = sequence && activeIndex >= Children.toArray(children).length
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])
  useEffect(() => {
    if (done) onCompleteRef.current?.()
  }, [done])

  const content = (
    <div
      ref={containerRef}
      className={`z-0 h-full max-h-100 w-full max-w-lg rounded-xl border border-border bg-background ${className}`}
    >
      <div className="flex flex-col gap-y-2 border-b border-border p-4">
        <div className="flex flex-row gap-x-2">
          <div className="h-2 w-2 rounded-full bg-foreground/60"></div>
          <div className="h-2 w-2 rounded-full bg-foreground/35"></div>
          <div className="h-2 w-2 rounded-full bg-foreground/15"></div>
        </div>
      </div>
      <pre className="px-4! py-4">
        <code className="grid gap-y-1 overflow-auto font-mono">{wrappedChildren}</code>
      </pre>
    </div>
  )

  if (!sequence) return content

  return (
    <SequenceContext.Provider value={contextValue}>
      {content}
    </SequenceContext.Provider>
  )
}
