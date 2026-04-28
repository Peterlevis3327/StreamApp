import {useColorScheme} from 'react-native'

import {darkPalette, lightPalette, type Palette} from './palette'

export interface AppTheme {
  isDark: boolean
  colors: Palette
}

export function useAppTheme(): AppTheme {
  const scheme = useColorScheme()
  const isDark = scheme === 'dark'

  return {
    isDark,
    colors: isDark ? darkPalette : lightPalette
  }
}
