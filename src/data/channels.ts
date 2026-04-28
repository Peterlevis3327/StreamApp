import channels from './generated/channels.json'
import manifest from './generated/manifest.json'
import type {PlaylistManifestItem, StreamChannel} from '../types'

export interface ChannelDataset {
  channels: StreamChannel[]
  manifest: PlaylistManifestItem[]
}

export function loadChannels(): ChannelDataset {
  return {
    channels: channels as StreamChannel[],
    manifest: manifest as PlaylistManifestItem[]
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
