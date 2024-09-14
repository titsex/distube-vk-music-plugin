import type {
	VKMusicAudioGetAudiosByArtistMethodParams,
	VKMusicAudioGetPlaylistByIdMethodParams,
	VKMusicAudioGetArtistByIdMethodParams,
	VKMusicAudioGetByIdMethodParams,
	VKMusicAudioGetMethodParams,
	VKMusicAudioPlaylist,
	VKMusicAudioArtist,
	VKMusicAudioSong,
	VKMusicAPI,
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
		count: 500,
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
		count: 500,
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
	params: VKMusicAudioGetByIdMethodParams
): Promise<VKMusicAudioSong[]> {
	const response = await vk.audio.getRecommendations({
		target_audio: params,
		count: 10,
	})

	if (!response || !response?.items) return []

	return response.items
}
