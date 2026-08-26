import posterBangladesh from '../assets/recap/poster-bangladesh.webp'
import posterIndia from '../assets/recap/poster-india.webp'

// The two most recent revivals, shown side by side (Figma 277:4416).
//
// Not Notion-driven yet, deliberately: the flyer artwork has no home in the
// HOWJ Global schema (Logo is the expression mark, not the event poster), and
// the Bangladesh row still has no Slug so it never reaches expressions.json.
// Add a Poster file property + a slug and this can read from the CMS like the
// rest of the site — the shape below is already the contract.
const REVIVALS = [
  {
    name: 'Bangladesh',
    poster: posterBangladesh,
    stats: [
      ['Attendance', '2,500'],
      ['Souls Saved', '50'],
    ],
    watchUrl: null,
  },
  {
    name: 'India',
    poster: posterIndia,
    stats: [
      ['Attendance', '2,200'],
      ['Souls Saved', '24'],
    ],
    watchUrl: 'https://www.youtube.com/watch?v=JML2kI0Vqto',
  },
]

function RevivalCard({ name, poster, stats, watchUrl }) {
  return (
    <article className="flex flex-col items-center gap-lg">
      <img
        src={poster}
        alt={`Hang Out With Jesus ${name} revival poster`}
        loading="lazy"
        className="w-full max-w-[28rem] rounded-md"
      />

      {/* Attendance / Souls Saved — label above the figure, per the design */}
      <div className="grid w-full max-w-[28rem] grid-cols-2 gap-md text-center text-text-inverse">
        {stats.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-xs">
            <p className="font-body text-lg font-bold sm:text-xl lg:text-3xl">{label}</p>
            {/* leading-[1] not leading-none: --spacing-none shadows it to line-height 0 */}
            <p className="font-body text-4xl font-bold leading-[1] sm:text-5xl lg:text-7xl">
              {value}
            </p>
          </div>
        ))}
      </div>

      {watchUrl ? (
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-lg font-bold text-text-inverse underline decoration-1 underline-offset-4 transition hover:opacity-70 lg:text-3xl"
        >
          Watch the Revival
        </a>
      ) : (
        // No documentary link yet — keep the slot so both cards stay aligned.
        <span className="font-body text-lg font-bold text-text-inverse/50 lg:text-3xl">
          Watch the Revival
        </span>
      )}
    </article>
  )
}

// Latest-revivals recap: full-bleed photo whose TOP gradient starts solid black
// (blending down from StatsSection) and eases open, a meta row, then the two
// most recent revival posters with their headline numbers.
export default function RecapSection({
  date = 'March 26 2026',
  place = 'Kerala',
  image = `${import.meta.env.BASE_URL}gallery/India-charity-01.jpg`,
  revivals = REVIVALS,
}) {
  return (
    <section className="relative flex min-h-screen overflow-hidden">
      <img src={image} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
      {/* Top gradient: solid black at the top edge (continues the blend from the
          section above) fading into a darkened photo. */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black/85"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-6 py-2xl lg:py-3xl">
        {/* meta row */}
        <div className="flex items-center justify-between text-base text-text-inverse sm:text-lg">
          <span>{date}</span>
          <span>{place}</span>
        </div>

        <div className="mt-2xl grid flex-1 items-start gap-3xl md:grid-cols-2 md:gap-xl lg:mt-3xl">
          {revivals.map((r) => (
            <div key={r.name} className="flex justify-center">
              <RevivalCard {...r} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
