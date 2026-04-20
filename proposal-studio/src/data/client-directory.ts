/**
 * Known-company directory used to power Client name autosuggest on the
 * intake form. Matches company names the assistant can confidently
 * classify into the INDUSTRY_SECTORS taxonomy. Keep entries canonical
 * (formal legal name, primary domain).
 *
 * Order matters in ties — put the most-common match first.
 */
export interface DirectoryEntry {
  name: string
  /** Short aliases the user might type. */
  aliases: string[]
  url: string
  industry: string
  sector: string
}

export const CLIENT_DIRECTORY: DirectoryEntry[] = [
  // ─── Pharma & Life Sciences
  {
    name: 'Eli Lilly And Company',
    aliases: ['Lilly'],
    url: 'lilly.com',
    industry: 'Health Industries',
    sector: 'Pharma and Life Sciences',
  },
  {
    name: 'Pfizer Inc.',
    aliases: ['Pfizer'],
    url: 'pfizer.com',
    industry: 'Health Industries',
    sector: 'Pharma and Life Sciences',
  },
  {
    name: 'Merck & Co., Inc.',
    aliases: ['Merck'],
    url: 'merck.com',
    industry: 'Health Industries',
    sector: 'Pharma and Life Sciences',
  },
  {
    name: 'Novartis AG',
    aliases: ['Novartis'],
    url: 'novartis.com',
    industry: 'Health Industries',
    sector: 'Pharma and Life Sciences',
  },
  {
    name: 'AstraZeneca plc',
    aliases: ['AstraZeneca'],
    url: 'astrazeneca.com',
    industry: 'Health Industries',
    sector: 'Pharma and Life Sciences',
  },
  {
    name: 'Sanofi S.A.',
    aliases: ['Sanofi'],
    url: 'sanofi.com',
    industry: 'Health Industries',
    sector: 'Pharma and Life Sciences',
  },
  {
    name: 'Roche Holding AG',
    aliases: ['Roche'],
    url: 'roche.com',
    industry: 'Health Industries',
    sector: 'Pharma and Life Sciences',
  },
  {
    name: 'Moderna, Inc.',
    aliases: ['Moderna'],
    url: 'modernatx.com',
    industry: 'Health Industries',
    sector: 'Pharma and Life Sciences',
  },
  {
    name: 'Johnson & Johnson',
    aliases: ['J&J', 'JnJ'],
    url: 'jnj.com',
    industry: 'Health Industries',
    sector: 'Pharma and Life Sciences',
  },
  // ─── Payers & Providers
  {
    name: 'UnitedHealth Group',
    aliases: ['UnitedHealth'],
    url: 'unitedhealthgroup.com',
    industry: 'Health Industries',
    sector: 'Payers and Providers',
  },
  {
    name: 'CVS Health Corporation',
    aliases: ['CVS', 'CVS Health'],
    url: 'cvshealth.com',
    industry: 'Health Industries',
    sector: 'Payers and Providers',
  },
  // ─── Financial Services — Banking
  {
    name: 'JPMorgan Chase & Co.',
    aliases: ['JPMorgan', 'Chase', 'JP Morgan'],
    url: 'jpmorganchase.com',
    industry: 'Financial Services',
    sector: 'Banking and Capital Markets',
  },
  {
    name: 'Goldman Sachs Group',
    aliases: ['Goldman Sachs', 'Goldman'],
    url: 'goldmansachs.com',
    industry: 'Financial Services',
    sector: 'Banking and Capital Markets',
  },
  {
    name: 'Morgan Stanley',
    aliases: [],
    url: 'morganstanley.com',
    industry: 'Financial Services',
    sector: 'Banking and Capital Markets',
  },
  // ─── Financial Services — Payments / Fintech
  {
    name: 'Stripe, Inc.',
    aliases: ['Stripe'],
    url: 'stripe.com',
    industry: 'Financial Services',
    sector: 'Banking and Capital Markets',
  },
  {
    name: 'PayPal Holdings, Inc.',
    aliases: ['PayPal'],
    url: 'paypal.com',
    industry: 'Financial Services',
    sector: 'Banking and Capital Markets',
  },
  // ─── Financial Services — Asset Management
  {
    name: 'BlackRock, Inc.',
    aliases: ['BlackRock'],
    url: 'blackrock.com',
    industry: 'Financial Services',
    sector: 'Asset and Wealth Management',
  },
  {
    name: 'The Vanguard Group, Inc.',
    aliases: ['Vanguard'],
    url: 'vanguard.com',
    industry: 'Financial Services',
    sector: 'Asset and Wealth Management',
  },
  // ─── Financial Services — Insurance
  {
    name: 'Berkshire Hathaway',
    aliases: [],
    url: 'berkshirehathaway.com',
    industry: 'Financial Services',
    sector: 'Insurance',
  },
  {
    name: 'Allianz SE',
    aliases: ['Allianz'],
    url: 'allianz.com',
    industry: 'Financial Services',
    sector: 'Insurance',
  },
  // ─── Technology, Media & Telecommunications
  {
    name: 'Apple Inc.',
    aliases: ['Apple'],
    url: 'apple.com',
    industry: 'Technology, Media & Telecommunications',
    sector: 'Technology',
  },
  {
    name: 'Microsoft Corporation',
    aliases: ['Microsoft'],
    url: 'microsoft.com',
    industry: 'Technology, Media & Telecommunications',
    sector: 'Technology',
  },
  {
    name: 'Alphabet Inc.',
    aliases: ['Google', 'Alphabet'],
    url: 'google.com',
    industry: 'Technology, Media & Telecommunications',
    sector: 'Technology',
  },
  {
    name: 'Meta Platforms, Inc.',
    aliases: ['Meta', 'Facebook'],
    url: 'meta.com',
    industry: 'Technology, Media & Telecommunications',
    sector: 'Technology',
  },
  {
    name: 'Amazon.com, Inc.',
    aliases: ['Amazon'],
    url: 'amazon.com',
    industry: 'Technology, Media & Telecommunications',
    sector: 'Technology',
  },
  {
    name: 'NVIDIA Corporation',
    aliases: ['Nvidia'],
    url: 'nvidia.com',
    industry: 'Technology, Media & Telecommunications',
    sector: 'Technology',
  },
  {
    name: 'Salesforce, Inc.',
    aliases: ['Salesforce'],
    url: 'salesforce.com',
    industry: 'Technology, Media & Telecommunications',
    sector: 'Technology',
  },
  {
    name: 'Oracle Corporation',
    aliases: ['Oracle'],
    url: 'oracle.com',
    industry: 'Technology, Media & Telecommunications',
    sector: 'Technology',
  },
  {
    name: 'Adobe Inc.',
    aliases: ['Adobe'],
    url: 'adobe.com',
    industry: 'Technology, Media & Telecommunications',
    sector: 'Technology',
  },
  {
    name: 'The Walt Disney Company',
    aliases: ['Disney'],
    url: 'thewaltdisneycompany.com',
    industry: 'Technology, Media & Telecommunications',
    sector: 'Media and Entertainment',
  },
  {
    name: 'Netflix, Inc.',
    aliases: ['Netflix'],
    url: 'netflix.com',
    industry: 'Technology, Media & Telecommunications',
    sector: 'Media and Entertainment',
  },
  {
    name: 'AT&T Inc.',
    aliases: ['AT&T', 'ATT'],
    url: 'att.com',
    industry: 'Technology, Media & Telecommunications',
    sector: 'Telecommunications',
  },
  {
    name: 'Verizon Communications Inc.',
    aliases: ['Verizon'],
    url: 'verizon.com',
    industry: 'Technology, Media & Telecommunications',
    sector: 'Telecommunications',
  },
  // ─── Consumer Markets
  {
    name: 'Walmart Inc.',
    aliases: ['Walmart'],
    url: 'walmart.com',
    industry: 'Consumer Markets',
    sector: 'Retail and Consumer',
  },
  {
    name: 'The Coca-Cola Company',
    aliases: ['Coca-Cola', 'Coke'],
    url: 'coca-colacompany.com',
    industry: 'Consumer Markets',
    sector: 'Retail and Consumer',
  },
  {
    name: 'PepsiCo, Inc.',
    aliases: ['PepsiCo', 'Pepsi'],
    url: 'pepsico.com',
    industry: 'Consumer Markets',
    sector: 'Retail and Consumer',
  },
  {
    name: 'Nike, Inc.',
    aliases: ['Nike'],
    url: 'nike.com',
    industry: 'Consumer Markets',
    sector: 'Retail and Consumer',
  },
  {
    name: 'Shopify Inc.',
    aliases: ['Shopify'],
    url: 'shopify.com',
    industry: 'Consumer Markets',
    sector: 'Commerce',
  },
  // ─── Industrial Products
  {
    name: 'General Electric Company',
    aliases: ['GE'],
    url: 'ge.com',
    industry: 'Industrial Products',
    sector: 'Manufacturing',
  },
  {
    name: 'Exxon Mobil Corporation',
    aliases: ['ExxonMobil', 'Exxon'],
    url: 'exxonmobil.com',
    industry: 'Industrial Products',
    sector: 'Energy and Utilities',
  },
  {
    name: 'Chevron Corporation',
    aliases: ['Chevron'],
    url: 'chevron.com',
    industry: 'Industrial Products',
    sector: 'Energy and Utilities',
  },
]

/**
 * Fuzzy filter the directory against a user query. Matches against both
 * canonical name and any alias. Returns a scored, ranked slice.
 */
export function searchDirectory(
  query: string,
  limit = 6,
): DirectoryEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const scored: Array<{ entry: DirectoryEntry; score: number }> = []

  for (const entry of CLIENT_DIRECTORY) {
    const name = entry.name.toLowerCase()
    const aliases = entry.aliases.map((a) => a.toLowerCase())
    const candidates = [name, ...aliases]

    let best = 0
    for (const c of candidates) {
      if (c === q) best = Math.max(best, 100)
      else if (c.startsWith(q)) best = Math.max(best, 80)
      else if (c.includes(q)) best = Math.max(best, 50)
    }

    if (best > 0) scored.push({ entry, score: best })
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((s) => s.entry)
}
