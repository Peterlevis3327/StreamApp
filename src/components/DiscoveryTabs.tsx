import React from 'react'
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native'

import type {DiscoveryTab} from '../types'
import type {Palette} from '../theme/palette'

const TABS: Array<{id: DiscoveryTab; label: string}> = [
  {id: 'all', label: 'All'},
  {id: 'sports', label: 'Sports'},
  {id: 'favorites', label: 'Favorites'},
  {id: 'recent', label: 'Recent'},
  {id: 'countries', label: 'Countries'},
  {id: 'providers', label: 'Providers'}
]

interface DiscoveryTabsProps {
  value: DiscoveryTab
  onChange: (value: DiscoveryTab) => void
  colors: Palette
}

export function DiscoveryTabs({value, onChange, colors}: DiscoveryTabsProps): React.JSX.Element {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {TABS.map(tab => {
        const active = value === tab.id

        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            style={[
              styles.tab,
              {
                backgroundColor: active ? colors.accent : colors.elevated,
                borderColor: active ? colors.accent : colors.border
              }
            ]}
          >
            <Text style={[styles.label, {color: active ? '#FFFFFF' : colors.textSecondary}]}>{tab.label}</Text>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  tab: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  label: {
    fontSize: 14,
    fontWeight: '600'
  }
})
