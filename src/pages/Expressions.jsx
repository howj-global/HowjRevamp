import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import CountryCard from '../components/CountryCard.jsx'
import site from '../content/site.json'
import expressions from '../content/expressions.json'
import sky from '../assets/backgrounds/sky.webp'

const base = import.meta.env.BASE_URL

// Curated real airport codes for the boarding-pass card — only added where the
// host city is confirmed, never guessed. Cards without an entry here simply
// omit the code line (CountryCard renders it conditionally).
const IATA_BY_SLUG = {
  brazil: 'BSB', // Brasília
  ghana: 'ACC', // Accra
}

const yearOf = (exp) => Number(String(exp.date ?? '').slice(0, 4)) || null

// One card per expression synced from the HOWJ Global Notion database
// (src/content/expressions.json, written by scripts/fetch-expressions.mjs).
// Only Published rows with a real Slug make it into that file, so this list
// grows automatically as more expressions go live — no hardcoding here.
const cards = Object.values(expressions).sort(
  (a, b) => (yearOf(a) ?? 0) - (yearOf(b) ?? 0) || a.slug.localeCompare(b.slug),
)

export default function Expressions() {
  const [activeYear, setActiveYear] = useState(null)

  // Continuous year rail from the earliest to the latest expression, so gap
  // years still appear on the timeline (and it extends itself as data grows).
  const years = useMemo(() => {
    const present = cards.map(yearOf).filter(Boolean)
    if (!present.length) return []
    const [min, max] = [Math.min(...present), Math.max(...present)]
    return Array.from({ length: max - min + 1 }, (_, i) => min + i)
  }, [])

  const yearsWithCards = useMemo(() => new Set(cards.map(yearOf)), [])
  const visible = activeYear ? cards.filter((c) => yearOf(c) === activeYear) : cards

  return (
    // negative top margin pulls the section under the sticky navbar so the sky
    // bleeds to the very top of the page (offsets match the navbar's height)
    <section className="relative -mt-[60px] min-h-screen bg-black sm:-mt-[64px] lg:-mt-[112px]">
      {/* sky backdrop across the top, fading into the black page */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[42rem]" aria-hidden="true">
        <img src={sky} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/75 to-black" />
      </div>

      <div className="relative mx-auto max-w-[82rem] px-6 pb-3xl pt-[104px] sm:pt-[112px] lg:px-2xl lg:pt-[168px]">
        <Reveal
          as="h1"
          className="font-heading text-6xl font-bold text-text-inverse lg:text-8xl"
        >
          {site.expressions?.heading ?? 'Expressions'}
        </Reveal>
        <Reveal as="p" delay={80} className="mt-sm max-w-[36rem] text-lg text-text-inverse/85">
          {site.expressions?.subheading}
        </Reveal>

        {cards.length === 0 ? (
          <p className="mt-2xl text-text-inverse/70">No expressions published yet — check back soon.</p>
        ) : (
          <div className="mt-2xl grid gap-2xl lg:grid-cols-[auto_1fr] lg:gap-xl">
            {/* year rail — filters the grid on desktop; scrolls as chips on mobile.
                min-w-[0px] is load-bearing: as a grid item this defaults to
                min-width:auto, so it sizes to the full year list (475px at 375px
                wide) instead of letting overflow-x-auto scroll. That widened the
                shared column and pushed the cards off-screen. Arbitrary value
                rather than min-w-0 — the custom --spacing tokens shadow that. */}
            <nav aria-label="Filter by year" className="min-w-[0px] lg:pt-sm">
              <ol className="relative flex gap-sm overflow-x-auto pb-sm lg:flex-col lg:gap-md lg:overflow-visible lg:pb-0">
                {/* connector line (desktop only) */}
                <span
                  className="absolute left-[5px] top-3 bottom-3 hidden w-px bg-text-inverse/30 lg:block"
                  aria-hidden="true"
                />
                {years.map((year) => {
                  const has = yearsWithCards.has(year)
                  const active = activeYear === year
                  return (
                    <li key={year} className="shrink-0">
                      <button
                        type="button"
                        disabled={!has}
                        aria-pressed={active}
                        onClick={() => setActiveYear(active ? null : year)}
                        className={`relative flex items-center gap-sm rounded-full px-sm py-1 transition lg:rounded-none lg:px-0 ${
                          has ? 'hover:opacity-100' : 'cursor-not-allowed opacity-35'
                        } ${active ? 'opacity-100' : 'opacity-70'}`}
                      >
                        <span
                          className={`hidden size-[11px] shrink-0 rounded-full border-2 border-text-inverse transition lg:block ${
                            active ? 'bg-text-inverse' : 'bg-black'
                          }`}
                          aria-hidden="true"
                        />
                        <span
                          className={`whitespace-nowrap font-heading text-lg text-text-inverse ${
                            active ? 'font-bold' : ''
                          }`}
                        >
                          {year}
                        </span>
                      </button>
                    </li>
                  )
                })}
                {activeYear && (
                  <li className="shrink-0 lg:mt-sm">
                    <button
                      type="button"
                      onClick={() => setActiveYear(null)}
                      className="whitespace-nowrap text-sm text-text-inverse/60 underline transition hover:text-text-inverse lg:ml-[27px]"
                    >
                      Show all
                    </button>
                  </li>
                )}
              </ol>
            </nav>

            {/* cards — auto-rows-fr + items-stretch keeps every card identical in
                size, even when a venue/city name wraps to more lines */}
            <div className="grid min-w-[0px] auto-rows-fr items-stretch gap-lg sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((exp, i) => (
                <Reveal key={exp.slug} delay={i * 70} className="h-full">
                  <Link
                    to={`/expression/${exp.slug}`}
                    className="block h-full transition hover:opacity-90"
                  >
                    <CountryCard
                      fluid
                      image={exp.heroImage ? base + exp.heroImage.replace(/^\//, '') : undefined}
                      country={exp.country}
                      church={exp.venue?.split('\n')[0].trim()}
                      city={exp.city}
                      code={IATA_BY_SLUG[exp.slug]}
                    />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
