// Single minister portrait card — rounded, cropped to a portrait aspect, with
// the minister's name captioned underneath. Used standalone and inside the
// MinistersSection vertical marquee.
export default function CardMinister({ photo, name }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-lg bg-neutral-white/5">
        {/* alt is empty because the name sits right below as real text — an alt
            here would have screen readers announce it twice. */}
        <img src={photo} alt="" loading="lazy" className="aspect-[3/4] w-full object-cover" />
      </div>
      <figcaption className="mt-xs font-heading text-sm font-semibold leading-snug text-text-inverse sm:text-base">
        {name}
      </figcaption>
    </figure>
  )
}
