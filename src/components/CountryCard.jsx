import CircleFlag, { FLAG_ACCENTS, normalizeCountry } from './CircleFlag.jsx'

// Pick black or white text for a given background so the stub stays legible
// whatever flag colour it's sampled from (e.g. saffron → black, navy → white).
function readableText(hex) {
  const c = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255)
  const lin = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  return L > 0.4 ? '#0b0b0b' : '#ffffff'
}

// Figma: Country card (node 132:3329). Feature image with a circular country
// flag top-right, and a dashed-top "boarding pass stub" footer holding the host
// church, city, and airport code. Fixed proportions from the design (394×581)
// expressed fluidly so it tiles in a responsive grid.
// Two sizes: the full destination card, and a `compact` variant for the small
// cards that float in the MissionSection.
const SIZES = {
  default: {
    card: 'max-w-[24.625rem]',
    flag: 'size-14 right-2.5 top-2.5',
    stub: 'gap-sm px-sm py-md',
    church: 'text-lg',
    title: 'text-5xl',
  },
  // Small floating MissionSection cards — scaled down a further 20%.
  compact: {
    card: 'max-w-[9.5rem]',
    flag: 'size-[1.4rem] right-1.5 top-1.5',
    stub: 'gap-1 px-2 py-2',
    church: 'text-[0.45rem]',
    title: 'text-[0.95rem]',
  },
}

export default function CountryCard({
  image,
  imageAlt,
  country,
  church,
  city,
  code,
  flag,
  accent,
  compact = false,
  // `fluid` drops the max-width so the card fills its grid column. Don't try to
  // override with `max-w-none` — the custom --spacing-none token shadows it and
  // it resolves to max-width:0 (see the Tailwind v4 note in CLAUDE.md).
  fluid = false,
  className = '',
}) {
  // Stub colour: explicit `accent` prop, else the country's flag accent, else the
  // brand green. Text and the dashed perforation adapt to stay legible.
  const bg = accent ?? FLAG_ACCENTS[normalizeCountry(country)] ?? '#0e6537'
  const fg = readableText(bg)
  const border = fg === '#ffffff' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.35)'
  const s = compact ? SIZES.compact : SIZES.default

  return (
    // h-full + a flex-1 stub let cards in a stretch grid match heights even when
    // the venue/city text wraps to a different number of lines.
    <article
      className={`flex h-full w-full flex-col overflow-hidden rounded-md ${fluid ? '' : s.card} ${className}`}
    >
      {/* feature image + flag badge. A published expression can legitimately have
          no Hero Image yet in Notion, so fall back to a tinted panel with the
          brand jet rather than rendering <img src={undefined}> and showing the
          browser's broken-image icon. */}
      <div className="relative aspect-[372/359] w-full bg-neutral-gray-100">
        {image ? (
          <img
            src={image}
            alt={imageAlt ?? city ?? country}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: bg }}
            aria-hidden="true"
          />
        )}
        <div className={`absolute ${s.flag}`}>
          {flag ?? <CircleFlag country={country} className="size-full" />}
        </div>
      </div>

      {/* detail stub — dashed perforation on top, like a boarding pass */}
      <div
        className={`flex flex-1 items-center border-t-4 border-dashed ${s.stub}`}
        style={{ backgroundColor: bg, color: fg, borderColor: border }}
      >
        <div className="flex min-w-0 flex-1 flex-col font-heading font-semibold">
          {church && <p className={`${s.church} leading-snug`}>{church}</p>}
          {/* leading-[1] not leading-none: --spacing-none shadows it to line-height 0 */}
          <p className={`${s.title} leading-[1]`}>{city}</p>
          {code && <p className={`${s.title} leading-[1]`}>{code}</p>}
        </div>
      </div>
    </article>
  )
}
