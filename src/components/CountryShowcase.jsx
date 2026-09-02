import { useEffect, useState } from 'react'
import gallery from '../content/gallery.json'

const base = import.meta.env.BASE_URL
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')

// One representative slide per country (first tagged image; categories sort
// alphabetically, so e.g. Kenya → "arrival"). Title/subtitle derive from tags.
const slides = (() => {
  const byCountry = new Map()
  for (const p of gallery) {
    if (!p.country || !p.category) continue
    if (!byCountry.has(p.country)) byCountry.set(p.country, p)
  }
  return [...byCountry.values()].map((p) => ({
    src: base + p.src.replace(/^\//, ''),
    title: `${p.country} ${cap(p.category)}`,
    subtitle: `Hang Out With Jesus ${p.country}`,
    alt: p.alt,
  }))
})()

const AUTOPLAY_MS = 3800

// Full-bleed focus carousel: a static center card shows the focused slide's
// details while the other images slide left→right past it, blurred and dimmed.
// Auto-advances; clicking a side image brings it to center. Pauses on hover.
export default function CountryShowcase() {
  const n = slides.length
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || n < 2) return
    // decrement so the strip travels left→right
    const id = setInterval(() => setActive((i) => (i - 1 + n) % n), AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [paused, n])

  if (!n) return null
  const activeSlide = slides[active]

  return (
    <section
      className="relative flex min-h-[120vh] items-center justify-center overflow-hidden bg-black py-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="HOWJ around the world"
    >
      {/* sliding blurred image strip; the centered one is hidden behind the card */}
      <div className="absolute inset-0 flex items-center justify-center">
        {slides.map((s, i) => {
          // shortest circular distance so wrapping stays smooth
          let offset = i - active
          if (offset > n / 2) offset -= n
          if (offset < -n / 2) offset += n
          if (Math.abs(offset) > 2) return null // only render a small window
          const isActive = offset === 0
          return (
            <button
              key={s.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${s.title}`}
              tabIndex={isActive ? -1 : 0}
              className="absolute h-[25rem] w-[19rem] max-w-[80vw] overflow-hidden rounded-2xl transition-all duration-700 ease-out"
              style={{
                transform: `translateX(${offset * 20}rem) scale(${isActive ? 1 : 0.82})`,
                zIndex: 10 - Math.abs(offset),
                filter: isActive ? 'none' : 'blur(6px) brightness(0.45)',
                opacity: isActive ? 0 : 1,
                pointerEvents: isActive ? 'none' : 'auto',
              }}
            >
              <img src={s.src} alt="" loading="lazy" className="size-full object-cover" />
            </button>
          )
        })}
      </div>

      {/* static center card (Figma 139:3317) — subtitle box + title/image box,
          both neutral-gray-100, joined by a dashed perforation with NO gap
          (boarding-pass style). Padding uses the strict spacing tokens
          (px-sm=16, py-md=24, px-xs=8). Card is 10% smaller than the original. */}
      <div className="relative z-20 flex w-[21.5rem] max-w-[90vw] flex-col items-center">
        <div key={active} className="card-swap-in flex w-full flex-col items-center">
          {/* subtitle box */}
          <div className="flex w-full items-center rounded-md bg-neutral-gray-100 px-sm py-md">
            <p className="truncate font-heading text-lg text-neutral-black">
              {activeSlide.subtitle}
            </p>
          </div>
          {/* dashed perforation — zero height so the two boxes stay flush */}
          <div className="h-0 w-[90%] border-t-2 border-dashed border-neutral-black/50" />
          {/* title + image box */}
          <div className="flex w-full flex-col rounded-md bg-neutral-gray-100 px-xs py-sm">
            <p className="font-heading text-4xl font-bold leading-tight text-neutral-black">
              {activeSlide.title}
            </p>
            <div className="w-full px-xs py-md">
              <div className="h-[232px] w-full overflow-hidden bg-neutral-gray-300">
                <img src={activeSlide.src} alt={activeSlide.alt} className="size-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
