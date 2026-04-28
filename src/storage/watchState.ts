import AsyncStorage from '@react-native-async-storage/async-storage'

const FAVORITES_KEY = 'streamapp:favorites'
const RECENTS_KEY = 'streamapp:recents'

export async function readFavorites(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as string[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function writeFavorites(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
}

export async function readRecents(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(RECENTS_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as string[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function pushRecent(id: string): Promise<string[]> {
  const current = await readRecents()
  const next = [id, ...current.filter(item => item !== id)].slice(0, 30)
  await AsyncStorage.setItem(RECENTS_KEY, JSON.stringify(next))
  return next
}
