import { Fragment, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import StatBlock from './StatBlock.jsx'
import { PLANE_PATH, PLANE_CENTER } from './PlaneIcon.jsx'
import photos from '../content/gallery.json'
import expressions from '../content/expressions.json'
import stats from '../content/stats.json'
import site from '../content/site.json'
import logo from '../assets/brand/howj-logo-white.svg'

// Charity photos drive the background slideshow. Sourced from BOTH the tagged
// gallery manifest and every expression's charity set in Notion, so the loop
// stays long and new charity images join automatically on the next build.
// BASE_URL prefix keeps the absolute paths correct under the Pages subpath.
const withBase = (src) => import.meta.env.BASE_URL + src.replace(/^\//, '')

const charitySlides = [
  ...new Set([
    ...photos.filter((p) => p.category === 'charity').map((p) => p.src),
    ...Object.values(expressions).flatMap((e) => e.charity?.images ?? []),
  ]),
].map(withBase)

// Symmetric grid from Figma (node 158:5433): left / center-logo / right columns,
// three rows. The logo sits in the middle cell; "In N years" is an eyebrow above.
//   countries      charity outreaches
//   missions  [logo]   cities
//   souls          attendance
//
// Every figure is derived at build time from the Published rows in HOWJ Global
// (see buildStats in scripts/fetch-expressions.mjs), so adding a revival in
// Notion updates this band on the next deploy — no second place to edit. The
// hardcoded values these replaced had drifted badly: 450k souls against an
// actual 1,102, and 1,500 attendees against 28,350.
// Published figure for a stat: an override from site.json if one is set,
// otherwise the value computed from Notion. Overrides exist because several
// headline numbers are editorial rather than raw sums — charity outreaches
// aren't all recorded as expressions, and attendance is quoted rounded down.
const overrides = site.statsOverrides ?? {}
const fmt = (key) => {
  const override = overrides[key]
  if (override != null && override !== '') return override
  const derived = stats[key]
  return typeof derived === 'number' ? derived.toLocaleString('en-US') : derived
}

// Years since the first revival, so the eyebrow ages by itself each January
// rather than quietly going stale (it read "In 4 years" into year five).
const yearsLabel = stats.years ? `In ${stats.years} year${stats.years === 1 ? '' : 's'}` : 'So far'

const leftColumn = [
  { number: fmt('countries'), label: 'countries visited' },
  { number: fmt('revivals'), label: 'Missions completed' },
  { number: fmt('souls'), label: 'souls saved' },
]
const rightColumn = [
  { number: fmt('charityOutreaches'), label: 'Charity welfare outreaches to the poor and forgotten' },
  { number: fmt('cities'), label: 'cities' },
  { number: fmt('attendance'), label: 'people combined have assembled to experience jesus christ' },
]

function StatItem({ stat }) {
  if (stat.text) {
    return (
      <p className="max-w-[13rem] text-center text-xl font-semibold leading-snug text-text-inverse lg:text-left">
        {stat.text}
      </p>
    )
  }
  return <StatBlock number={stat.number} label={stat.label} />
}

// Dotted flight-path curves from Figma (node 152:5690), desktop only. Each of the
// three sub-curves draws on one after another (staggered --d), a start-dot fades
// in with each, and the plane lands last. The dotted look lives on the visible
// stroke; the draw-on is a thick-stroke mask whose dashoffset animates 1→0.
const CURVES = [
  { d: 'M815.138 566.337C536.638 1334.34 -341.863 789.337 148.633 110.337', start: [815.138, 566.337], delay: 0 },
  {
    d: 'M493.633 160.837C701.133 -101.663 956.11 21.5601 954.134 110.337C951.664 221.307 819.174 255.337 771.134 173.337C691.75 37.8369 952.134 -46.6632 1166.63 95.8368',
    start: [493.633, 160.837],
    delay: 1.2,
  },
  // Start pulled left so the trail + its dot begin just outside the right-hand
  // stat block instead of landing on top of the "1500+" text (measured: the dot
  // sat ~36px inside the block). Control points are untouched, so the curve
  // keeps its Figma shape — only the tail near the dot shifts.
  { d: 'M1145.14 893.837C1736.78 820.412 1668.14 221.337 1478.64 95.8368', start: [1145.14, 893.837], delay: 2.4 },
]
const PLANE_DELAY = 3.6

function OrbitCurves() {
  return (
    <svg viewBox="0 0 1621.9 943.294" fill="none" preserveAspectRatio="xMidYMid meet" className="size-full">
      <defs>
        {CURVES.map((c, i) => (
          <mask key={i} id={`orbit-mask-${i}`} maskUnits="userSpaceOnUse">
            <path
              d={c.d}
              pathLength="1"
              fill="none"
              stroke="#fff"
              strokeWidth="16"
              className="orbit-draw"
              style={{ '--d': `${c.delay}s` }}
            />
          </mask>
        ))}
      </defs>
      {CURVES.map((c, i) => (
        <path
          key={i}
          d={c.d}
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeDasharray="8 8"
          opacity="0.9"
          mask={`url(#orbit-mask-${i})`}
        />
      ))}
      {/* start-dot markers, fading in with each curve */}
      {CURVES.map((c, i) => (
        <circle
          key={i}
          cx={c.start[0]}
          cy={c.start[1]}
          r="9"
          fill="#fff"
          className="orbit-fade"
          style={{ '--d': `${c.delay}s` }}
        />
      ))}
      {/* plane — lands last, lower-left, angled up the curve (Figma 158:7624:
          ~7.7% left / ~79% down, rotate -123.71°). Same brand jet as PlaneIcon;
          scale 0.195 on the 682-wide viewBox matches the previous icon width. */}
      <g
        className="orbit-fade"
        style={{ '--d': `${PLANE_DELAY}s` }}
        transform={`translate(650 862) rotate(-33) scale(0.195) translate(${-PLANE_CENTER.x} ${-PLANE_CENTER.y})`}
      >
        <path fill="#fff" fillRule="evenodd" d={PLANE_PATH} />
      </g>
    </svg>
  )
}

export default function StatsSection() {
  // Slower background pace: 8s per slide with a 2s crossfade (see the img classes).
  // Any slide whose file 404s is dropped from the rotation rather than left to
  // show as an empty frame — a stale manifest path used to stall the slideshow.
  const [slides, setSlides] = useState(charitySlides)
  const [active, setActive] = useState(0)
  const dropSlide = (src) =>
    setSlides((list) => (list.length > 1 ? list.filter((s) => s !== src) : list))

  useEffect(() => {
    if (slides.length < 2) return
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 8000)
    return () => clearInterval(id)
  }, [slides.length])

  // GSAP center-logo animation: on scroll-in, the logo eases up from small +
  // faded + tilted, then settles into a gentle, endless float.
  const logoRef = useRef(null)
  useEffect(() => {
    const el = logoRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let tl
    const io = new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0].isIntersecting) return
        tl = gsap.timeline()
        tl.from(el, { autoAlpha: 0, scale: 0.5, rotate: -8, duration: 1, ease: 'back.out(1.7)' }).to(
          el,
          { yPercent: -6, duration: 2.6, ease: 'sine.inOut', repeat: -1, yoyo: true },
        )
        obs.disconnect()
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      tl?.kill()
    }
  }, [])

  // Trigger the orbit draw-on when the section scrolls into view. We observe the
  // always-rendered section (not the `hidden lg:block` orbit div, which reports
  // no intersection while display:none) so the trigger is width-independent.
  const orbitRef = useRef(null)
  const sectionRef = useRef(null)
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const io = new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0].isIntersecting) return
        orbitRef.current?.classList.add('play')
        obs.disconnect()
      },
      { threshold: 0.2 },
    )
    io.observe(section)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden lg:flex lg:min-h-[140vh] lg:items-center lg:justify-center">
      {/* crossfading slideshow — stacked images fade between each other */}
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
            onError={() => dropSlide(src)}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-[2000ms] ${
              i === active % slides.length ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
      {/* Gradient overlay: keeps text contrast AND fades to solid black at the
          bottom edge so it blends seamlessly into the RecapSection below. */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black"
        aria-hidden="true"
      />

      {/* Dotted flight-path orbit — desktop only. Constrained to roughly the width
          of the stats grid and centred (Figma 222:6621: the curve frame is ~68% of
          the section width, centred) so the trails hug the numbers instead of
          spreading to the viewport edges. */}
      <div
        ref={orbitRef}
        className="orbit pointer-events-none absolute inset-0 z-10 hidden items-center justify-center lg:flex"
        aria-hidden="true"
      >
        <div className="aspect-[1622/943] w-full max-w-[62rem]">
          <OrbitCurves />
        </div>
      </div>

      {/* Desktop (lg+): symmetric 3-row grid with the logo dead-center. */}
      <div className="relative z-20 hidden w-full max-w-[60rem] px-6 lg:block">
        <p className="mb-10 text-lg text-text-inverse/80">{yearsLabel}</p>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-8 gap-y-12 xl:gap-x-16">
          {[0, 1, 2].map((row) => (
            <Fragment key={row}>
              <div className="justify-self-center">
                <StatItem stat={leftColumn[row]} />
              </div>
              {row === 1 ? (
                <img ref={logoRef} src={logo} alt="Hang Out With Jesus" className="w-52 xl:w-60" />
              ) : (
                <div aria-hidden="true" />
              )}
              <div className="justify-self-center">
                <StatItem stat={rightColumn[row]} />
              </div>
            </Fragment>
          ))}
        </div>
      </div>

      {/* Below lg: centered stack — single column on phones, two columns from
          md up so tablets/iPads fill the width instead of running one long row. */}
      <div className="relative z-20 flex w-full flex-col items-center gap-2xl px-6 py-2xl lg:hidden">
        <img src={logo} alt="Hang Out With Jesus" className="w-44 md:w-52" />
        <p className="text-lg text-text-inverse/80">{yearsLabel}</p>
        <div className="grid w-full max-w-[44rem] grid-cols-1 justify-items-center gap-2xl md:grid-cols-2">
          {[...leftColumn, ...rightColumn].map((stat, i) => (
            <StatItem key={i} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
