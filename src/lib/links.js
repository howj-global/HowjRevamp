// External registration form (Google Forms). Every "Register" CTA on the site
// points here — keep it in one place so the link can be swapped per revival
// without hunting through components.
export const REGISTER_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScrF5LvryCye6cW7xyb6tqQYGqPDKWdZ1XurdTXpRo8lWTYcw/viewform'

// Spread onto an <a> so external links always open safely in a new tab.
export const externalLinkProps = { target: '_blank', rel: 'noopener noreferrer' }
