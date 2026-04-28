import type {DiscoveryTab, StreamChannel} from '../../types'

export interface FilterInput {
  tab: DiscoveryTab
  search: string
  favorites: Set<string>
  recents: Set<string>
  country?: string
  provider?: string
}

export function filterChannels(items: StreamChannel[], input: FilterInput): StreamChannel[] {
  const query = input.search.trim().toLowerCase()

  return items.filter(channel => {
    if (input.tab === 'sports' && !channel.isSports) {
      return false
    }

    if (input.tab === 'favorites' && !input.favorites.has(channel.id)) {
      return false
    }

    if (input.tab === 'recent' && !input.recents.has(channel.id)) {
      return false
    }

    if (input.country && channel.country !== input.country) {
      return false
    }

    if (input.provider && channel.provider !== input.provider) {
      return false
    }

    if (!query) {
      return true
    }

    return [
      channel.name,
      channel.groupTitle,
      channel.provider,
      channel.country,
      channel.playlist,
      channel.sportsTags.join(' ')
    ]
      .filter(Boolean)
      .some(value => value!.toLowerCase().includes(query))
  })
}
