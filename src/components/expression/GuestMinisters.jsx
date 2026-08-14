import MinisterCard from './MinisterCard.jsx'

// Section heading above a row of guest-minister cards (Figma 176:5610).
// `items-stretch` keeps the cards a uniform height across the row.
export default function GuestMinisters({ ministers = [] }) {
  return (
    <section className="mx-auto max-w-[90rem] px-6 py-2xl lg:px-4xl">
      <h2 className="font-condensed text-5xl font-bold uppercase text-neutral-black lg:text-7xl">
        Guest Ministers
      </h2>
      <div className="mt-md grid grid-cols-1 items-stretch gap-sm sm:grid-cols-2 lg:grid-cols-3">
        {ministers.map((minister, i) => (
          <MinisterCard key={i} name={minister.name} image={minister.image} />
        ))}
      </div>
    </section>
  )
}
