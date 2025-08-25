'use client'
import { useEffect, useState } from "react"

export default function GlobalLoader({ children }) {
  const [loading, setLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true) // start fade-out
      setTimeout(() => setLoading(false), 500) // wait for animation, then remove
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center bg-white z-[9999] transition-opacity duration-500 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="w-14 h-14 border-4 border-[#21b573] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return <>{children}</>
}

