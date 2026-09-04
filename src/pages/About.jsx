import Reveal from '../components/Reveal.jsx'
import site from '../content/site.json'
import { REGISTER_URL, externalLinkProps } from '../lib/links.js'

const base = import.meta.env.BASE_URL
const src = (p) => base + String(p).replace(/^\//, '')

// About page (Figma 129:1424, HOWJ Global revamp) — Mews-style editorial layout:
// light hero + video, stats row, dark story timeline, people rail, values list,
// "feeling inspired" CTA. All content lives in site.json (`about`); all styling
// uses the design tokens.
export default function About() {
  const a = site.about

  return (
    <div className="bg-surface-page">
      {/* ---- Hero: copy left, video card right ---- */}
      <section className="mx-auto grid max-w-[70rem] items-center gap-2xl px-6 pb-2xl pt-3xl lg:grid-cols-2 lg:px-4xl">
        <div>
          <Reveal as="p" className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            {a.hero.eyebrow}
          </Reveal>
          <Reveal
            as="h1"
            delay={60}
            className="mt-sm font-condensed text-6xl font-bold uppercase leading-[0.95] text-neutral-black lg:text-7xl"
          >
            {a.hero.title}
          </Reveal>
          <Reveal as="p" delay={120} className="mt-lg max-w-[28rem] text-base leading-relaxed text-neutral-gray-700">
            {a.hero.body}
          </Reveal>
          <Reveal delay={180}>
            <a
              href={a.hero.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-lg inline-flex rounded-full bg-brand-primary-500 px-lg py-xs font-heading text-sm font-semibold uppercase tracking-wide text-neutral-black transition hover:brightness-95"
            >
              {a.hero.ctaLabel}
            </a>
          </Reveal>
        </div>

        <Reveal delay={140}>
          <a
            href={a.hero.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-md"
            aria-label={a.hero.ctaLabel}
          >
            <img src={src(a.hero.videoImage)} alt="" className="aspect-video w-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-neutral-black/20">
              <span className="flex size-16 items-center justify-center rounded-full bg-neutral-white/90 transition group-hover:scale-110">
                <svg viewBox="0 0 24 24" className="ml-1 size-6 fill-neutral-black" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </a>
        </Reveal>
      </section>

      {/* ---- Stats row (numbers from the homepage) ---- */}
      <section className="mx-auto grid max-w-[70rem] grid-cols-1 gap-y-lg border-t border-border-default px-6 py-2xl sm:grid-cols-3 sm:gap-x-lg lg:px-4xl">
        {a.stats.map((stat, i) => (
          <Reveal key={i} delay={i * 80}>
            {/* leading-[1] not leading-none: --spacing-none shadows it to 0 */}
            <p className="font-condensed text-6xl font-bold leading-[1] text-neutral-black">{stat.value}</p>
            <p className="mt-xs max-w-[12rem] text-xs uppercase tracking-wide text-text-muted">{stat.label}</p>
          </Reveal>
        ))}
      </section>

      {/* ---- Our story: dark timeline block ---- */}
      <section className="mx-6 rounded-lg bg-black lg:mx-lg">
        <div className="mx-auto max-w-[70rem] px-6 py-3xl lg:px-4xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-gray-500">{a.story.eyebrow}</p>
          <Reveal
            as="h2"
            className="mt-md max-w-[38rem] font-heading text-3xl font-bold leading-snug text-text-inverse lg:text-4xl"
          >
            {a.story.headline}
          </Reveal>

          <div className="mt-2xl grid gap-2xl lg:grid-cols-[1fr_2fr]">
            {/* Left rail notes. The rail sticks as ONE block: previously each
                note was individually `sticky top-40`, so on scroll every one
                pinned to the same offset and they piled up on top of each
                other. self-start stops the grid stretching the item, which
                would otherwise leave nothing to scroll against. */}
            <div className="lg:sticky lg:top-40 lg:self-start">
              <div className="flex flex-col gap-2xl">
                {a.story.notes.map((note, i) => (
                  <Reveal key={i} as="p" className="max-w-[18rem] text-base leading-relaxed text-neutral-gray-300">
                    {note}
                  </Reveal>
                ))}
              </div>
            </div>

            {/* timeline */}
            <div>
              {a.story.timeline.map((item, i) => (
                <Reveal
                  key={i}
                  delay={(i % 4) * 60}
                  className="grid grid-cols-[7rem_1fr] items-center gap-md border-t border-neutral-white/15 py-md sm:grid-cols-[11rem_1fr]"
                >
                  <img
                    src={src(item.image)}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded-sm object-cover"
                  />
                  <div>
                    <p className="font-condensed text-4xl font-bold leading-[1] text-text-inverse">
                      {item.year} <span className="text-neutral-gray-500">· {item.city}</span>
                    </p>
                    <p className="mt-xs font-heading text-base font-semibold text-text-inverse">{item.title}</p>
                    <p className="mt-1 text-sm leading-snug text-neutral-gray-400">{item.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* "Our people make HOWJ" section removed along with its data in
              site.json — the page stays on Jesus rather than the team. */}
        </div>
      </section>

      {/* ---- Values ---- */}
      <section className="mx-auto grid max-w-[70rem] gap-2xl px-6 py-3xl lg:grid-cols-[1fr_1.2fr] lg:px-4xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-text-muted">{a.values.eyebrow}</p>
          <Reveal as="h2" className="mt-sm max-w-[20rem] font-heading text-3xl font-bold leading-snug text-neutral-black">
            {a.values.heading}
          </Reveal>
          <div className="mt-lg flex items-stretch gap-md">
            <div className="flex aspect-[3/4] w-40 flex-col justify-between rounded-sm bg-brand-primary-900 p-sm">
              <p className="font-condensed text-3xl font-bold leading-[1] text-text-inverse">
                {a.values.poster.line1}
                <br />
                {a.values.poster.line2}
              </p>
              <p className="text-xs uppercase tracking-wide text-brand-primary-300">HOWJ</p>
            </div>
            <img src={src(a.values.posterImage)} alt="" className="aspect-[3/4] w-40 rounded-sm object-cover" />
          </div>
        </div>

        <div>
          {a.values.items.map((item, i) => (
            <Reveal key={i} delay={i * 60} className="border-t border-border-default py-md">
              <div className="grid grid-cols-[1fr_auto] items-start gap-md">
                <div>
                  <h3 className="font-heading text-lg font-bold text-neutral-black">{item.title}</h3>
                  <p className="mt-xs max-w-[30rem] text-sm leading-relaxed text-neutral-gray-700">{item.body}</p>
                </div>
                <span className="font-condensed text-sm text-text-muted">{String(i + 1).padStart(2, '0')}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- Feeling inspired ---- */}
      <section className="relative mx-auto max-w-[80rem] px-6 py-3xl">
        <div className="pointer-events-none absolute left-6 top-1/2 hidden w-40 -translate-y-1/2 flex-col gap-md lg:flex">
          {a.inspired.images.slice(0, 2).map((img) => (
            <img key={img} src={src(img)} alt="" className="aspect-[4/3] w-full rotate-[-3deg] rounded-sm object-cover" />
          ))}
        </div>
        <div className="pointer-events-none absolute right-6 top-1/2 hidden w-40 -translate-y-1/2 flex-col gap-md lg:flex">
          {a.inspired.images.slice(2, 4).map((img) => (
            <img key={img} src={src(img)} alt="" className="aspect-[4/3] w-full rotate-[3deg] rounded-sm object-cover" />
          ))}
        </div>

        <div className="mx-auto flex max-w-[28rem] flex-col items-center gap-md text-center">
          <Reveal as="h2" className="font-condensed text-5xl font-bold uppercase text-neutral-black lg:text-6xl">
            {a.inspired.heading}
          </Reveal>
          <Reveal as="p" delay={80} className="text-base text-neutral-gray-700">
            {a.inspired.body}
          </Reveal>
          <Reveal delay={140}>
            <a
              href={REGISTER_URL}
              {...externalLinkProps}
              className="inline-flex rounded-full bg-brand-secondary px-xl py-sm font-heading text-base font-bold uppercase tracking-wide text-neutral-black transition hover:brightness-95"
            >
              {a.inspired.ctaLabel}
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
