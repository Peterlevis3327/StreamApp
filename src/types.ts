export type SportsTag =
  | 'football'
  | 'soccer'
  | 'tennis'
  | 'premier_league'
  | 'uefa_champions_league'
  | 'supersport'
  | 'other_sport'

export interface StreamChannel {
  id: string
  name: string
  url: string
  tvgId?: string
  tvgName?: string
  logo?: string
  groupTitle?: string
  playlist: string
  provider?: string
  country?: string
  isSports: boolean
  sportsTags: SportsTag[]
  sourceRecencyScore: number
}

export interface PlaylistManifestItem {
  file: string
  updatedAt: string
  score: number
}

export type DiscoveryTab =
  | 'all'
  | 'sports'
  | 'favorites'
  | 'recent'
  | 'countries'
  | 'providers'
