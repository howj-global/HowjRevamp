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
    date: 'March 26 & 27, 2026',
    location: 'Dhaka, Bangladesh',
    poster: posterBangladesh,
    stats: [
      ['Attendance', '3,000'],
      ['Souls Saved', '479'],
    ],
    watchUrl: 'https://www.youtube.com/watch?v=ejFWOKgYVVY',
  },
  {
    name: 'India',
    date: 'April 04, 2026',
    location: 'Kerala, India',
    poster: posterIndia,
    stats: [
      ['Attendance', '2,200'],
      ['Souls Saved', '70'],
    ],
    watchUrl: 'https://www.youtube.com/watch?v=JML2kI0Vqto',
  },
]

function RevivalCard({ name, date, location, poster, stats, watchUrl }) {
  return (
    <article className="flex flex-col items-center gap-lg">
      {/* Date and place sit on one row per card, so each pair reads as a single
          revival rather than floating at opposite ends of the whole section. */}
      <div className="flex w-full max-w-[28rem] items-baseline justify-between gap-md text-text-inverse">
        <span className="font-body text-base sm:text-lg">{date}</span>
        <span className="font-body text-base sm:text-lg">{location}</span>
      </div>

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
          Watch the Documentary
        </a>
      ) : (
        // No documentary link yet — keep the slot so both cards stay aligned.
        <span className="font-body text-lg font-bold text-text-inverse/50 lg:text-3xl">
          Watch the Documentary
        </span>
      )}
    </article>
  )
}

// Latest-revivals recap: full-bleed photo whose TOP gradient starts solid black
// (blending down from StatsSection) and eases open, then the two most recent
// revival posters with their headline numbers. Each card carries its own
// date/place row, so both halves clearly belong to one revival — the section
// used to split them across its full width with nothing tying them together.
export default function RecapSection({
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
        <div className="grid flex-1 items-start gap-3xl md:grid-cols-2 md:gap-xl">
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
