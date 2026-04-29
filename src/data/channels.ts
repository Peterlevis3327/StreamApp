import type {PlaylistManifestItem, StreamChannel} from '../types'

declare const require: (path: string) => unknown

export interface ChannelDataset {
  channels: StreamChannel[]
  manifest: PlaylistManifestItem[]
}

export function loadChannels(): ChannelDataset {
  const channels = require('./generated/channels.json') as StreamChannel[]
  const manifest = require('./generated/manifest.json') as PlaylistManifestItem[]

  return {
    channels,
    manifest
  }
}

export function sortChannelsForFastDiscovery(items: StreamChannel[]): StreamChannel[] {
  return [...items].sort((a, b) => {
    if (b.sourceRecencyScore !== a.sourceRecencyScore) {
      return b.sourceRecencyScore - a.sourceRecencyScore
    }

    return a.name.localeCompare(b.name)
  })
}
