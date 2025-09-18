export type Category = 'Groceries' | 'Dining' | 'Transport' | 'Entertainment' | 'Bills' | 'Rent' | 'Salary' | 'Other'

type Rule = { pattern: RegExp; category: Category; why: string }

const rules: Rule[] = [
  { pattern:/\bcoles\b|\bwoolworths\b|\baldi\b/i, category:'Groceries',      why:'Matched supermarket keyword' },
  { pattern:/7[- ]?eleven|cafe|coffee|macca|kfc|starbucks|hungry jacks/i,    category:'Dining',         why:'Matched cafe/fast food keyword' },
  { pattern:/uber|ola|ptv|myki|tram|train|bus|fuel|bp|caltex/i,              category:'Transport',      why:'Matched transport keyword' },
  { pattern:/netflix|spotify|steam|cinema|movie/i,                           category:'Entertainment',  why:'Matched entertainment keyword' },
  { pattern:/rent|landlord/i,                                                category:'Rent',           why:'Matched rent keyword' },
  { pattern:/aglc|electric|water|gas|internet|telstra|optus|vodafone/i,      category:'Bills',          why:'Matched utilities/telecom keyword' },
  { pattern:/salary|payroll|employer|wage|stipend/i,                         category:'Salary',         why:'Matched salary keyword' },
]

export function autoCategory(merchant: string): { category: Category; why: string } {
  for (const r of rules) if (r.pattern.test(merchant)) return { category: r.category, why: r.why }
  return { category: 'Other', why: 'No rule matched' }
}
export const ALL_CATS: Category[] = ['Groceries','Dining','Transport','Entertainment','Bills','Rent','Salary','Other']
