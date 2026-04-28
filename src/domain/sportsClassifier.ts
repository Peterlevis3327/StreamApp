import type {SportsTag} from '../types'

const SPORT_KEYWORDS: Array<{regex: RegExp; tag: SportsTag}> = [
  {regex: /\bfootball\b/i, tag: 'football'},
  {regex: /\bsoccer\b/i, tag: 'soccer'},
  {regex: /\btennis\b/i, tag: 'tennis'},
  {regex: /\bpremier\s*league\b/i, tag: 'premier_league'},
  {regex: /\buefa\s*champions\s*league\b|\bucl\b/i, tag: 'uefa_champions_league'},
  {regex: /\bsupersport\b/i, tag: 'supersport'},
  {
    regex:
      /\bnba\b|\bnfl\b|\bmlb\b|\bcricket\b|\bgolf\b|\bmotorsport\b|\bf1\b|\brugby\b|\bboxing\b|\bmma\b|\bwrestling\b/i,
    tag: 'other_sport'
  }
]

export interface SportClassificationInput {
  name: string
  groupTitle?: string
  categories?: string[]
}

export function classifySportsChannel(input: SportClassificationInput): {
  isSports: boolean
  tags: SportsTag[]
} {
  const tags = new Set<SportsTag>()

  const metadataSports = (input.categories ?? []).some(category =>
    /\bsports?\b/i.test(category)
  )

  const haystack = [input.name, input.groupTitle].filter(Boolean).join(' ')

  for (const item of SPORT_KEYWORDS) {
    if (item.regex.test(haystack)) {
      tags.add(item.tag)
    }
  }

  return {
    isSports: metadataSports || tags.size > 0,
    tags: [...tags]
  }
}
