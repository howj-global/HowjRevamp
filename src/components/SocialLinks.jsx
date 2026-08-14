import { socialLinks } from '../lib/social.js'
import facebook from '../assets/social/facebook.svg'
import x from '../assets/social/x.svg'
import instagram from '../assets/social/instagram.svg'
import youtube from '../assets/social/youtube.svg'

const icons = { facebook, x, instagram, youtube }

// Desktop-only row of social icons for the hero (reference: bottom-center,
// over the background, white glyphs). className lets callers position it.
export default function SocialLinks({ className = '' }) {
  return (
    <ul className={`flex items-center gap-lg ${className}`}>
      {socialLinks.map((s) => (
        <li key={s.key}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="block opacity-90 transition hover:opacity-100"
          >
            <img src={icons[s.key]} alt="" aria-hidden="true" className="h-6 w-auto" />
          </a>
        </li>
      ))}
    </ul>
  )
}
