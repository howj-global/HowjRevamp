import { useRef, useState } from 'react'

// Expression gallery (Figma 203:4413, was "Charity Highlight"): a light
// coverflow row of every photo Notion has for this expression (the
// pre-existing "Images" field — see scripts/fetch-expressions.mjs). The
// centered photo sits in a light-gray frame; users drag/swipe right→left (or
// click a side image) to move through them.
export default function Gallery({ title, images = [] }) {
  const n = images.length
  const [active, setActive] = useState(0)

  // drag / swipe: pull left → next, pull right → previous
  const dragX = useRef(null)
  const onDown = (e) => {
    dragX.current = e.clientX
  }
  const onUp = (e) => {
    if (dragX.current == null || n < 2) return
    const dx = e.clientX - dragX.current
    dragX.current = null
    if (Math.abs(dx) < 40) return
    setActive((i) => (dx < 0 ? (i + 1) % n : (i - 1 + n) % n))
  }

  if (!n) return null

  return (
    <section className="bg-surface-page py-3xl">
      <div className="mx-auto flex max-w-[90rem] flex-col items-center gap-xs px-6 text-center lg:px-4xl">
        <h2 className="font-condensed text-5xl font-bold uppercase text-neutral-black lg:text-7xl">
          {title}
        </h2>
        <p className="font-body text-sm font-light text-neutral-black">Click to view some Highlights</p>
      </div>

      <div
        className="relative mt-lg flex h-[26rem] cursor-grab touch-pan-y select-none items-center justify-center overflow-hidden active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerLeave={() => (dragX.current = null)}
      >
        {/* flanking images (sharp, smaller); the centred one is hidden behind the frame */}
        {images.map((src, i) => {
          let offset = i - active
          if (offset > n / 2) offset -= n
          if (offset < -n / 2) offset += n
          if (Math.abs(offset) > 2) return null
          const isActive = offset === 0
          return (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label="Show charity photo"
              className="absolute h-[17rem] w-[16rem] overflow-hidden transition-all duration-700 ease-out"
              style={{
                transform: `translateX(${offset * 18}rem)`,
                zIndex: 10 - Math.abs(offset),
                opacity: isActive ? 0 : 1,
                pointerEvents: isActive ? 'none' : 'auto',
              }}
            >
              <img src={src} alt="" loading="lazy" draggable="false" className="size-full object-cover" />
            </button>
          )
        })}

        {/* centred image in a light-gray frame */}
        <div className="pointer-events-none relative z-20 bg-neutral-gray-100 p-lg shadow-sm">
          <div key={active} className="card-swap-in h-[21rem] w-[19.5rem] overflow-hidden">
            <img src={images[active]} alt="" draggable="false" className="size-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}
