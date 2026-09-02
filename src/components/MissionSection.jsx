import Reveal from './Reveal.jsx'
import site from '../content/site.json'
import mission1 from '../assets/mission/mission-1.webp'
import mission2 from '../assets/mission/mission-2.webp'

// Cities covered over the past 4 years — scroll left→right in the top marquee.
const cities = [
  'BRASILIA', 'NEW YORK', 'KERALA', 'CHICAGO', 'ATLANTA', 'LAGOS',
  'SEOUL', 'ACCRA', 'LONDON', 'NAIROBI', 'DHAKA',
]

function CityMarquee() {
  return (
    <div className="marquee border-y border-neutral-black/10 py-md lg:py-2xl">
      <div className="marquee-track">
        {[false, true].map((clone) => (
          <div key={clone ? 'clone' : 'original'} className="flex" aria-hidden={clone || undefined}>
            {cities.map((city) => (
              <span key={city} className="flex items-center whitespace-nowrap">
                <span className="px-8 font-heading text-xl font-semibold uppercase tracking-wide text-neutral-black sm:px-12 sm:text-2xl">
                  {city}
                </span>
                <span className="size-1.5 rounded-full bg-brand-secondary" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Shared headline-line styling (Figma 236:4426): Barlow Condensed Bold, 96px
// on desktop (text-8xl) for all three lines, black, single line — no colour
// highlights, no left/right edge-justification. Each row is its own
// tightly-packed, centred flex group, not stretched across a grid.
const LINE_CLASS = 'font-condensed text-6xl font-bold uppercase leading-[0.95] text-neutral-black sm:text-7xl lg:text-8xl lg:leading-[1] lg:whitespace-nowrap'

export default function MissionSection() {
  const m = site.mission

  return (
    <section className="bg-surface-page">
      <CityMarquee />

      <div className="mx-auto max-w-[90rem] px-6 py-2xl lg:py-4xl">
        {/* Figma 246:4453: eyebrow sits spacing/3xl (96px) above the headline
            block; the three headline lines themselves are packed with no gap
            between them. */}
        <div className="flex flex-col items-center gap-2xl text-center lg:gap-3xl">
          {/* eyebrow — Barlow Light, 30px on desktop (text-3xl) per Figma */}
          <Reveal as="p" delay={0} className="font-body text-xl font-light text-neutral-black sm:text-2xl lg:text-3xl">
            {m.eyebrow}
          </Reveal>

          {/* Sequential reveal: line 1 -> image 1 -> line 2 -> line 3 -> image 2,
              each gated behind the previous via a stepped delay so they read as
              one cascade rather than firing all at once. */}
          <div className="flex flex-col items-center gap-xs">
            {/* line 1 — full row, alone */}
            <Reveal delay={150} as="h2" className={LINE_CLASS}>
              {m.lines[0]}
            </Reveal>

            {/* line 2 ("Souls Saved") — image immediately beside the text,
                centred as one unit. The photos travel with their line rather
                than staying put, so worship pairs with souls saved and the
                students with disciples made; the frame proportions are
                position-based and stay as the Figma has them. */}
            <div className="flex flex-col items-center gap-xs lg:flex-row">
              <Reveal delay={300} className="overflow-hidden rounded-md">
                {/* object-position pulled up: the 484:130 letterbox only shows ~40%
                    of this 3:2 photo, and centring it cut the faces off the top. */}
                <img
                  src={mission1}
                  alt=""
                  loading="lazy"
                  className="aspect-[484/130] w-[18rem] object-cover object-[50%_28%] sm:w-[24rem] lg:w-[30rem]"
                />
              </Reveal>
              <Reveal delay={450} as="h2" className={LINE_CLASS}>
                {m.lines[1]}
              </Reveal>
            </div>

            {/* line 3 ("Disciples Made") — text immediately beside the image */}
            <div className="flex flex-col items-center gap-xs lg:flex-row">
              <Reveal delay={600} as="h2" className={LINE_CLASS}>
                {m.lines[2]}
              </Reveal>
              <Reveal delay={750} className="overflow-hidden rounded-md">
                <img
                  src={mission2}
                  alt=""
                  loading="lazy"
                  className="aspect-[459/164] w-[18rem] object-cover object-[50%_22%] sm:w-[24rem] lg:w-[30rem]"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
