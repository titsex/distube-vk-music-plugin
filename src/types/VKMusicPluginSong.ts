import { type ResolveOptions, Song as DistubeSong } from 'distube'
import type { VKMusicAudioSong } from 'vk-music-api-wrapper'
import { VK_MUSIC_PLUGIN_SOURCE } from '../constant'
import type { VKMusicPlugin } from '../plugin'

export class VKMusicPluginSong<T> extends DistubeSong<T> {
	constructor(plugin: VKMusicPlugin, info: VKMusicAudioSong, options: ResolveOptions<T> = {}) {
		super(
			{
				plugin,
				source: VK_MUSIC_PLUGIN_SOURCE,
				playFromSource: false,
				id: info.id.toString(),
				url: info.url,
				name: info.title,
				duration: info.duration,
				isLive: false,
				uploader: {
					name: info.artist,
				},
			},
			options
		)
	}
}
