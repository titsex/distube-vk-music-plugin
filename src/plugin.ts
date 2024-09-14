import {
	type VKMusicPluginOptions,
	VKMusicPluginPlaylist,
	VKMusicPluginErrors,
	VKMusicPluginArtist,
	VKMusicPluginSong,
} from './types'

import { getPlaylistAndSongs, getArtistAndSongs, fetchSong, fetchRelatedSongs } from './api'
import { DisTubeError, PlayableExtractorPlugin, type ResolveOptions } from 'distube'
import { VKMusicAPI, VKMusicAPIBool } from 'vk-music-api-wrapper'
import { getLinkType, getParamsByURL, parseURL } from './utils'
import { VK_MUSIC_PLUGIN_SOURCE } from './constant'

class VKMusicPlugin extends PlayableExtractorPlugin {
	private readonly vk: VKMusicAPI

	constructor(options: VKMusicPluginOptions) {
		super()

		if (typeof options !== 'object' || Array.isArray(options)) {
			throw new DisTubeError(
				'INVALID_TYPE',
				['object', 'undefined'],
				options,
				'VKMusicPluginOptions'
			)
		}

		this.vk = new VKMusicAPI({
			token: options.token,
		})
	}

	async validate(url: string): Promise<boolean> {
		return url.includes('vk.com')
	}

	async resolve<T>(url: string, options: ResolveOptions<T>) {
		const parsedUrl = parseURL(url)

		const linkType = getLinkType(parsedUrl)
		const paramsList = getParamsByURL(parsedUrl, linkType)

		if (linkType === 'playlist') {
			const [playlist, songs] = await getPlaylistAndSongs(this.vk, {
				owner_id: paramsList[0],
				playlist_id: paramsList[1],
				album_id: paramsList[1],
			})

			return new VKMusicPluginPlaylist<T>(
				playlist,
				url,
				songs.map((song) => new VKMusicPluginSong<T>(this, song, options)),
				options
			)
		}

		if (linkType === 'artist') {
			const [artist, songs] = await getArtistAndSongs(this.vk, {
				artist_id: paramsList[0],
				extended: VKMusicAPIBool.TRUE,
			})

			return new VKMusicPluginArtist<T>(
				artist,
				url,
				songs.map((song) => new VKMusicPluginSong<T>(this, song, options)),
				options
			)
		}

		if (linkType === 'song') {
			const song = await fetchSong(this.vk, {
				owner_id: paramsList[0],
				id: paramsList[1],
				access_key: paramsList[2],
			})

			return new VKMusicPluginSong<T>(this, song, options)
		}

		throw new DisTubeError(VK_MUSIC_PLUGIN_SOURCE, VKMusicPluginErrors.URL_NOT_SUPPORT)
	}

	async getRelatedSongs<T>(song: VKMusicPluginSong<T>) {
		const [owner_id, id, access_key] = song.id.split('_')

		const songs = await fetchRelatedSongs(this.vk, {
			owner_id,
			id,
			access_key,
		})

		return songs.map((song) => new VKMusicPluginSong(this, song))
	}

	getStreamURL<T>(song: VKMusicPluginSong<T>) {
		if (!song.url) {
			throw new DisTubeError(VK_MUSIC_PLUGIN_SOURCE, VKMusicPluginErrors.SONG_NOT_FOUND)
		}

		return song.url
	}
}

export { VKMusicPlugin, VKMusicPluginErrors }
