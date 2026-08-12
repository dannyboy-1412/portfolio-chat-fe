'use client'

import { useEffect, useRef, useState } from 'react'

type Drop = {
  x: number
  y: number
  length: number
  speed: number
  opacity: number
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function RainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frameId = 0
    let running = true
    let drops: Drop[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(160, Math.floor(window.innerWidth / 8))
      drops = Array.from({ length: count }, () => createDrop(window.innerHeight, true))
    }

    const createDrop = (height: number, randomY: boolean): Drop => ({
      x: Math.random() * window.innerWidth,
      y: randomY ? Math.random() * height : -Math.random() * 40,
      length: 8 + Math.random() * 16,
      speed: 4 + Math.random() * 8,
      opacity: 0.15 + Math.random() * 0.35,
    })

    const draw = () => {
      if (!running) return

      if (
        document.hidden ||
        prefersReducedMotion() ||
        document.documentElement.dataset.theme !== 'ok-computer'
      ) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        frameId = window.requestAnimationFrame(draw)
        return
      }

      const width = window.innerWidth
      const height = window.innerHeight
      ctx.clearRect(0, 0, width, height)

      for (const drop of drops) {
        ctx.strokeStyle = `hsla(200, 20%, 75%, ${drop.opacity})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x - 0.8, drop.y + drop.length)
        ctx.stroke()

        drop.y += drop.speed
        drop.x -= drop.speed * 0.12

        if (drop.y > height + 20) {
          Object.assign(drop, createDrop(height, false))
        }
      }

      frameId = window.requestAnimationFrame(draw)
    }

    resize()
    frameId = window.requestAnimationFrame(draw)
    window.addEventListener('resize', resize)

    return () => {
      running = false
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
    }
  }, [reducedMotion])

  return (
    <div className="pointer-events-none absolute inset-0 ok-sky" aria-hidden>
      {!reducedMotion && (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      )}
      <svg
        className="absolute bottom-[8%] left-1/2 w-[min(420px,70vw)] -translate-x-1/2 text-surface-950/80"
        viewBox="0 0 320 80"
        fill="currentColor"
        role="presentation"
      >
        <ellipse cx="160" cy="68" rx="90" ry="8" className="opacity-30" />
        <path d="M48 58c8-2 18-18 28-22 6-3 14-2 20 2 4 3 8 4 12 2 6-3 14-1 18 4l8 10c3 4 8 6 13 5 9-1 16 6 14 14H42c-2-6 1-13 6-15z" />
        <circle cx="78" cy="42" r="10" />
        <path d="M86 40c10-8 22-10 34-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  )
}
