import React from 'react'
import {Pressable, StyleSheet, Text, View} from 'react-native'

import type {StreamChannel} from '../types'
import type {Palette} from '../theme/palette'

interface ChannelCardProps {
  channel: StreamChannel
  colors: Palette
  favorite: boolean
  onSelect: (channel: StreamChannel) => void
  onToggleFavorite: (channel: StreamChannel) => void
}

export function ChannelCard({
  channel,
  colors,
  favorite,
  onSelect,
  onToggleFavorite
}: ChannelCardProps): React.JSX.Element {
  return (
    <Pressable
      onPress={() => onSelect(channel)}
      style={[styles.root, {backgroundColor: colors.card, borderColor: colors.border}]}
    >
      <View style={styles.mainArea}>
        <Text style={[styles.name, {color: colors.textPrimary}]} numberOfLines={1}>
          {channel.name}
        </Text>
        <Text style={[styles.meta, {color: colors.textSecondary}]} numberOfLines={1}>
          {[channel.country, channel.provider, channel.groupTitle].filter(Boolean).join(' • ')}
        </Text>
        {channel.isSports ? (
          <Text style={[styles.tag, {color: colors.accent}]}>
            Sports {channel.sportsTags.length ? `• ${channel.sportsTags.join(', ')}` : ''}
          </Text>
        ) : null}
      </View>

      <Pressable
        onPress={() => onToggleFavorite(channel)}
        style={[styles.favorite, {borderColor: colors.border, backgroundColor: colors.elevated}]}
      >
        <Text style={[styles.favoriteText, {color: favorite ? colors.accent : colors.textSecondary}]}>♥</Text>
      </Pressable>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  mainArea: {
    flex: 1,
    marginRight: 12
  },
  name: {
    fontSize: 16,
    fontWeight: '700'
  },
  meta: {
    marginTop: 4,
    fontSize: 13
  },
  tag: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600'
  },
  favorite: {
    minWidth: 34,
    minHeight: 34,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  favoriteText: {
    fontSize: 16,
    fontWeight: '700'
  }
})
