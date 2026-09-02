import CardMinister from './CardMinister.jsx'
import ministers from '../content/ministers.json'

// Real line-up drives the marquee (edit names/roles in src/content/ministers.json).
// BASE_URL keeps the /ministers/ paths correct under the GitHub Pages subpath.
const withBase = (p) => import.meta.env.BASE_URL + p.replace(/^\//, '')
const all = ministers.map((m) => ({ ...m, photo: withBase(m.photo) }))

// Split across the two scrolling columns.
const colA = all.filter((_, i) => i % 2 === 0)
const colB = all.filter((_, i) => i % 2 === 1)

// One vertically-scrolling column. The card list is duplicated so the -50%
// keyframe loops seamlessly; the duplicate is aria-hidden to avoid double reads.
function MarqueeColumn({ items, duration, className = '' }) {
  return (
    <div className={`minister-col flex flex-col ${className}`} style={{ animationDuration: duration }}>
      {[...items, ...items].map((m, i) => (
        <div key={`${m.photo}-${i}`} className="mb-4 sm:mb-6" aria-hidden={i >= items.length || undefined}>
          <CardMinister photo={m.photo} name={m.name} />
        </div>
      ))}
    </div>
  )
}

export default function MinistersSection() {
  return (
    <section className="bg-black">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-2xl px-6 py-2xl lg:min-h-screen lg:grid-cols-2 lg:items-center lg:gap-xl">
        {/* Left column — static text, vertically centered */}
        <div className="flex flex-col justify-center">
          <h2 className="font-heading text-6xl font-bold leading-[1.05] text-text-inverse sm:text-7xl lg:text-8xl">
            Guest Ministers
          </h2>
          <p className="mt-lg max-w-[28rem] text-lg leading-snug text-neutral-gray-300 sm:text-xl">
            Over 50 anointed servants of God have partnered with Hang Out With Jesus, carrying His
            word to the nations.
          </p>
        </div>

        {/* Right column — dual vertical marquee with a top/bottom fade mask */}
        <div
          className="minister-marquee relative h-[600px] overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          }}
        >
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <MarqueeColumn items={colA} duration="32s" />
            {/* second column offset + slower so the two don't scroll in lockstep */}
            <MarqueeColumn items={colB} duration="40s" className="-mt-16" />
          </div>
        </div>
      </div>
    </section>
  )
}
