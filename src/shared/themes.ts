export type AlbumThemeId = 'blurryface' | 'ok-computer' | 'blue-album'

export type ThemeId = 'default' | AlbumThemeId

export type ThemeDefinition = {
  id: AlbumThemeId
  artist: string
  album: string
  years: string
  tagline: string
}

/** Original portfolio look — used until the visitor picks a record. */
export const DEFAULT_THEME_ID: ThemeId = 'default'

export const THEME_STORAGE_KEY = 'portfolio-theme'

export const THEMES: readonly ThemeDefinition[] = [
  {
    id: 'blurryface',
    artist: 'Twenty One Pilots',
    album: 'Blurryface',
    years: '2015',
    tagline: 'Red marks on black — Blurryface energy.',
  },
  {
    id: 'ok-computer',
    artist: 'Radiohead',
    album: 'OK Computer',
    years: '1997',
    tagline: 'Cold rain and washed-out blue.',
  },
  {
    id: 'blue-album',
    artist: 'The Beatles',
    album: 'Abbey Road',
    years: '1969',
    tagline: 'Zebra stripes, sky blue, and leaf green.',
  },
] as const

export function isAlbumThemeId(
  value: string | null | undefined
): value is AlbumThemeId {
  return THEMES.some((theme) => theme.id === value)
}

export function isThemeId(value: string | null | undefined): value is ThemeId {
  return value === DEFAULT_THEME_ID || isAlbumThemeId(value)
}
