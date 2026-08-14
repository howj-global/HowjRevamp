// Charity feature: a large title + overview, then two feature images side by side.
export default function CharitySection({ charity }) {
  return (
    <section className="mx-auto max-w-[90rem] px-6 py-2xl lg:px-4xl">
      <div className="flex flex-col gap-lg lg:flex-row lg:items-end lg:justify-between">
        <h2 className="font-condensed text-5xl font-bold uppercase leading-[0.95] text-neutral-black lg:w-1/2 lg:text-7xl">
          {charity.title}
        </h2>
        <p className="font-body text-lg leading-relaxed text-neutral-black lg:w-1/2">
          {charity.overview}
        </p>
      </div>

      <div className="mt-lg grid grid-cols-1 items-stretch gap-sm sm:grid-cols-2">
        {charity.images.map((src, i) => (
          <div key={i} className="overflow-hidden rounded-md">
            <img src={src} alt="" className="aspect-[784/540] size-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  )
}
