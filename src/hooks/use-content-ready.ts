"use client"

import { useEffect, useState } from "react"

/** Content mounts when its Suspense fallback clears; let it paint before animating. */
export function useContentReady() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setReady(true))
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  return ready
}
