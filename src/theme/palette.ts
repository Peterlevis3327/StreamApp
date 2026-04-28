export interface Palette {
  background: string
  card: string
  elevated: string
  textPrimary: string
  textSecondary: string
  accent: string
  border: string
  danger: string
}

export const lightPalette: Palette = {
  background: '#F7F8FA',
  card: '#FFFFFF',
  elevated: '#F0F3F8',
  textPrimary: '#101828',
  textSecondary: '#475467',
  accent: '#006CFA',
  border: '#D0D5DD',
  danger: '#D92D20'
}

export const darkPalette: Palette = {
  background: '#0B111D',
  card: '#121A2A',
  elevated: '#1A2438',
  textPrimary: '#F2F4F7',
  textSecondary: '#98A2B3',
  accent: '#49A6FF',
  border: '#27334B',
  danger: '#FF6B6B'
}
