import {
	type VKMusicPluginOptions,
	VKMusicPluginPlaylist,
	VKMusicPluginSong,
	VKMusicPluginErrors,
} from './types'

import { DisTubeError, PlayableExtractorPlugin, type ResolveOptions } from 'distube'
import { VK_MUSIC_PLUGIN_SOURCE, VK_PLUGIN_ERROR_CODE } from './constant'
import { getLinkType, getParamsByURL, parseURL } from './utils'
import { VKMusicAPI } from 'vk-music-api-wrapper'
import { VKMusicPlaylist } from './api'

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

		const playlistApi = new VKMusicPlaylist(this.vk)

		const params = {
			owner_id: paramsList[0],
			playlist_id: paramsList[1],
			album_id: paramsList[1],
		}

		const songs = (await playlistApi.getAllSongs(params)).map(
			(song) => new VKMusicPluginSong<T>(this, song, options)
		)

		const playlistInfo = await this.vk.audio.getPlaylistById(params)

		return new VKMusicPluginPlaylist<T>(playlistInfo, url, songs, options)
	}

	getRelatedSongs() {
		return []
	}

	getStreamURL<T>(song: VKMusicPluginSong<T>) {
		if (!song.url) {
			throw new DisTubeError(
				VK_MUSIC_PLUGIN_SOURCE,
				'Cannot get stream url from invalid song.'
			)
		}

		return song.url
	}
}

export { VKMusicPlugin, VKMusicPluginErrors, VK_PLUGIN_ERROR_CODE }
