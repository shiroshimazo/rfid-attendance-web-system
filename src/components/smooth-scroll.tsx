"use client"

import { useEffect, useState, type ReactNode } from "react"
import type { LenisOptions } from "lenis"
import { ReactLenis } from "lenis/react"

// Same feel as https://jrmy-sh.vercel.app/ — Lenis with a low lerp for
// buttery wheel smoothing, native touch scrolling, and anchor offset for
// the sticky header.
const lenisOptions = {
  autoRaf: true,
  autoToggle: true,
  smoothWheel: true,
  lerp: 0.075,
  wheelMultiplier: 0.9,
  syncTouch: false,
  anchors: { offset: -72 },
  stopInertiaOnNavigate: true,
  respectReducedMotion: true,
} satisfies LenisOptions

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

export function SmoothScroll({ children }: { children: ReactNode }) {
  // SSR-safe: assume motion is fine until the client tells us otherwise,
  // mirroring the reference site which skips Lenis entirely on reduced motion.
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY)
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  if (reducedMotion) return <>{children}</>

  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  )
}
