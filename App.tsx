import React from 'react'
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'

import {ChannelCard} from './src/components/ChannelCard'
import {DiscoveryTabs} from './src/components/DiscoveryTabs'
import {loadChannels, sortChannelsForFastDiscovery} from './src/data/channels'
import {filterChannels} from './src/features/channels/filters'
import {PlayerSheet} from './src/features/player/PlayerSheet'
import {readFavorites, readRecents, pushRecent, writeFavorites} from './src/storage/watchState'
import {useAppTheme} from './src/theme/useTheme'
import type {DiscoveryTab, StreamChannel} from './src/types'

function App(): React.JSX.Element {
  const {colors, isDark} = useAppTheme()

  const [tab, setTab] = React.useState<DiscoveryTab>('all')
  const [search, setSearch] = React.useState('')
  const [selected, setSelected] = React.useState<StreamChannel | undefined>()
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set())
  const [recents, setRecents] = React.useState<Set<string>>(new Set())
  const [country, setCountry] = React.useState<string | undefined>()
  const [provider, setProvider] = React.useState<string | undefined>()

  const dataset = React.useMemo(() => loadChannels(), [])
  const channels = React.useMemo(
    () => sortChannelsForFastDiscovery(dataset.channels),
    [dataset.channels]
  )

  const sportsCount = React.useMemo(
    () => channels.filter((item: StreamChannel) => item.isSports).length,
    [channels]
  )

  React.useEffect(() => {
    const bootstrap = async () => {
      const [favoriteIds, recentIds] = await Promise.all([readFavorites(), readRecents()])
      setFavorites(new Set(favoriteIds))
      setRecents(new Set(recentIds))
    }

    bootstrap().catch(() => {
      setFavorites(new Set())
      setRecents(new Set())
    })
  }, [])

  const countries = React.useMemo(
    () => [...new Set(channels.map((item: StreamChannel) => item.country).filter(Boolean))] as string[],
    [channels]
  )

  const providers = React.useMemo(
    () =>
      [...new Set(channels.map((item: StreamChannel) => item.provider).filter(Boolean))] as string[],
    [channels]
  )

  const filtered = React.useMemo(() => {
    return filterChannels(channels, {
      tab,
      search,
      favorites,
      recents,
      country,
      provider
    })
  }, [channels, tab, search, favorites, recents, country, provider])

  const selectedIndex = React.useMemo(() => {
    if (!selected) {
      return -1
    }

    return filtered.findIndex((item: StreamChannel) => item.id === selected.id)
  }, [filtered, selected])

  const setAndTrackSelected = React.useCallback(async (channel: StreamChannel) => {
    setSelected(channel)
    const nextRecents = await pushRecent(channel.id)
    setRecents(new Set(nextRecents))
  }, [])

  const toggleFavorite = React.useCallback(
    async (channel: StreamChannel) => {
      const next = new Set<string>(favorites)
      if (next.has(channel.id)) {
        next.delete(channel.id)
      } else {
        next.add(channel.id)
      }

      setFavorites(next)
      await writeFavorites(Array.from(next))
    },
    [favorites]
  )

  const goToChannelWithOffset = React.useCallback(
    (offset: number) => {
      if (!filtered.length) {
        return
      }

      const start = selectedIndex < 0 ? 0 : selectedIndex
      const nextIndex = (start + offset + filtered.length) % filtered.length
      const next = filtered[nextIndex]

      if (next) {
        setAndTrackSelected(next).catch(() => undefined)
      }
    },
    [filtered, selectedIndex, setAndTrackSelected]
  )

  return (
    <SafeAreaView style={[styles.screen, {backgroundColor: colors.background}]}> 
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <Text style={[styles.title, {color: colors.textPrimary}]}>StreamApp</Text>
        <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
          Recent playlists load first for faster discovery.
        </Text>
        <Text style={[styles.caption, {color: colors.textSecondary}]}> 
          {channels.length.toLocaleString()} channels • {sportsCount.toLocaleString()} sports channels
        </Text>
      </View>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search channels, sports, provider..."
        placeholderTextColor={colors.textSecondary}
        style={[
          styles.search,
          {
            color: colors.textPrimary,
            backgroundColor: colors.card,
            borderColor: colors.border
          }
        ]}
      />

      <DiscoveryTabs value={tab} onChange={setTab} colors={colors} />

      {(tab === 'countries' || tab === 'providers') && (
        <View style={styles.quickFilters}>
          {(tab === 'countries' ? countries : providers).slice(0, 12).map((item: string) => {
            const selectedFilter = tab === 'countries' ? country === item : provider === item

            return (
              <Pressable
                key={item}
                onPress={() => {
                  if (tab === 'countries') {
                    setCountry(selectedFilter ? undefined : item)
                  } else {
                    setProvider(selectedFilter ? undefined : item)
                  }
                }}
                style={[
                  styles.quickFilter,
                  {
                    borderColor: selectedFilter ? colors.accent : colors.border,
                    backgroundColor: selectedFilter ? colors.elevated : colors.card
                  }
                ]}
              >
                <Text style={{color: selectedFilter ? colors.accent : colors.textSecondary}}>{item}</Text>
              </Pressable>
            )
          })}
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item: StreamChannel) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({item}: {item: StreamChannel}) => (
          <ChannelCard
            channel={item}
            colors={colors}
            favorite={favorites.has(item.id)}
            onSelect={(channel: StreamChannel) => {
              setAndTrackSelected(channel).catch(() => undefined)
            }}
            onToggleFavorite={(channel: StreamChannel) => {
              toggleFavorite(channel).catch(() => undefined)
            }}
          />
        )}
        ListEmptyComponent={
          <View style={[styles.empty, {backgroundColor: colors.card, borderColor: colors.border}]}> 
            <Text style={[styles.emptyTitle, {color: colors.textPrimary}]}>No channels found</Text>
            <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
              Run generate:playlists first, then adjust search or filters.
            </Text>
          </View>
        }
      />

      <PlayerSheet
        visible={Boolean(selected)}
        channel={selected}
        onClose={() => setSelected(undefined)}
        onPrevious={() => goToChannelWithOffset(-1)}
        onNext={() => goToChannelWithOffset(1)}
        colors={colors}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 4
  },
  title: {
    fontSize: 28,
    fontWeight: '800'
  },
  subtitle: {
    fontSize: 13
  },
  caption: {
    fontSize: 12,
    fontWeight: '600'
  },
  search: {
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15
  },
  quickFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8
  },
  quickFilter: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24
  },
  empty: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700'
  },
  emptyText: {
    marginTop: 6,
    fontSize: 13
  }
})

export default App
