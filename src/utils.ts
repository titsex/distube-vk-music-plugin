import {
	IS_ARTIST_REGEX,
	IS_AUDIO_REGEX,
	IS_PLAYLIST_OR_ALBUM_REGEX,
	IS_USER_OR_GROUP_REGEX,
} from './constant'

import type { LinkType } from './types'

export function getLinkType(url: string): LinkType {
	if (IS_PLAYLIST_OR_ALBUM_REGEX.test(url)) return 'playlist'
	if (IS_ARTIST_REGEX.test(url)) return 'artist'
	if (IS_AUDIO_REGEX.test(url)) return 'song'

	return 'userOrGroup'
}

export function parseURL(url: string): string {
	return url.replace(/http(?:s|):\/\/(?:m\.|)vk\.com\//i, '').replace('%2F', '')
}

export function getParamsByURL(url: string, type: LinkType): string[] {
	if (type === 'playlist') return url.match(IS_PLAYLIST_OR_ALBUM_REGEX)!.slice(1, 4)
	if (type === 'artist') return url.match(IS_ARTIST_REGEX)!.slice(1, 2)
	if (type === 'song') return url.match(IS_AUDIO_REGEX)!.slice(1, 4)

	return url.match(IS_USER_OR_GROUP_REGEX)!.slice(1, 2)
}
