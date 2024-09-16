import type {
	VKMusicAPI,
	VKMusicAudioArtist,
	VKMusicAudioGetArtistByIdMethodParams,
	VKMusicAudioGetAudiosByArtistMethodParams,
	VKMusicAudioGetByIdMethodParams,
	VKMusicAudioGetMethodParams,
	VKMusicAudioGetPlaylistByIdMethodParams,
	VKMusicAudioPlaylist,
	VKMusicAudioSong,
} from 'vk-music-api-wrapper'

import { VKMusicPluginErrors } from './types'

export async function getPlaylistAndSongs(
	vk: VKMusicAPI,
	params: VKMusicAudioGetMethodParams & VKMusicAudioGetPlaylistByIdMethodParams
): Promise<[playlist: VKMusicAudioPlaylist, songs: VKMusicAudioSong[]]> {
	const playlist = await vk.audio.getPlaylistById(params)

	if (!playlist) {
		throw new Error(VKMusicPluginErrors.PLAYLIST_NOT_FOUND)
	}

	let offset = 0

	let response = await vk.audio.get({
		count: 5000,
		...params,
		offset,
	})

	const songs = []
	const totalSongsCount = response.count

	if (!totalSongsCount) {
		throw new Error(VKMusicPluginErrors.PLAYLIST_SONGS_NOT_FOUND)
	}

	songs.push(...response.items)
	offset += songs.length

	while (totalSongsCount > songs.length) {
		response = await vk.audio.get({
			count: 5000,
			...params,
			offset,
		})

		if (!response || !response.items.length) {
			break
		}

		songs.push(...response.items)
		offset += songs.length
	}

	return [playlist, songs]
}

export async function getArtistAndSongs(
	vk: VKMusicAPI,
	params: VKMusicAudioGetAudiosByArtistMethodParams & VKMusicAudioGetArtistByIdMethodParams
): Promise<[artist: VKMusicAudioArtist, songs: VKMusicAudioSong[]]> {
	const artist = await vk.audio.getArtistById(params)

	if (!artist || !artist.name) {
		throw new Error(VKMusicPluginErrors.ARTIST_NOT_FOUND)
	}

	let offset = 0

	let response = await vk.audio.getAudiosByArtist({
		count: 1000,
		...params,
		offset,
	})

	const songs = []
	const totalSongsCount = response.count

	if (!totalSongsCount) {
		throw new Error(VKMusicPluginErrors.ARTIST_SONGS_NOT_FOUND)
	}

	songs.push(...response.items)
	offset += songs.length

	while (totalSongsCount > songs.length) {
		response = await vk.audio.getAudiosByArtist({
			count: 1000,
			...params,
			offset,
		})

		if (!response || !response.items.length) {
			break
		}

		songs.push(...response.items)
		offset += songs.length
	}

	return [artist, songs]
}

export async function getUserOrGroupSongs(
	vk: VKMusicAPI,
	screen_name: string
): Promise<[owner_id: string, songs: VKMusicAudioSong[]]> {
	const params = await vk.resolveScreenName(screen_name)

	if (Array.isArray(params)) {
		throw new Error(VKMusicPluginErrors.USER_OR_GROUP_NOT_FOUND)
	}

	if (!['group', 'user'].includes(params.type)) {
		throw new Error(VKMusicPluginErrors.URL_NOT_SUPPORT)
	}

	const owner_id = `${params.type === 'group' ? '-' : ''}${params.object_id}`

	let offset = 0

	let response = await vk.audio.get({
		count: 5000,
		owner_id,
		offset,
	})

	const songs = []
	const totalSongsCount = response.count

	if (!totalSongsCount) {
		throw new Error(
			params.type === 'group'
				? VKMusicPluginErrors.GROUP_SONGS_NOT_FOUND
				: VKMusicPluginErrors.USER_SONGS_NOT_FOUND
		)
	}

	songs.push(...response.items)
	offset += songs.length

	while (totalSongsCount > songs.length) {
		response = await vk.audio.get({
			count: 5000,
			owner_id,
			offset,
		})

		if (!response || !response.items.length) {
			break
		}

		songs.push(...response.items)
		offset += songs.length
	}

	return [owner_id, songs]
}

export async function fetchSong(
	vk: VKMusicAPI,
	params: VKMusicAudioGetByIdMethodParams
): Promise<VKMusicAudioSong> {
	const songs = await vk.audio.getById([params])

	if (!songs || !songs.length) {
		throw new Error(VKMusicPluginErrors.SONG_NOT_FOUND)
	}

	return songs[0]
}

export async function fetchRelatedSongs(
	vk: VKMusicAPI,
	params: VKMusicAudioGetByIdMethodParams,
	count = 1000
): Promise<VKMusicAudioSong[]> {
	const response = await vk.audio.getRecommendations({
		target_audio: params,
		count,
	})

	if (!response || !response?.items) return []

	return response.items
}
