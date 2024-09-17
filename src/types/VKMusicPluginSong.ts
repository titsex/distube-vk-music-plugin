import { type ResolveOptions, Song as DistubeSong } from 'distube'
import type { VKMusicAudioSong } from 'vk-music-api-wrapper'
import { VK_MUSIC_PLUGIN_SOURCE } from '../constant'
import type { VKMusicPlugin } from '../plugin'
import { getSongDirectUrl } from '../utils'

export class VKMusicPluginSong<T> extends DistubeSong<T> {
	public streamUrl: string

	constructor(plugin: VKMusicPlugin, info: VKMusicAudioSong, options: ResolveOptions<T> = {}) {
		super(
			{
				plugin,
				source: VK_MUSIC_PLUGIN_SOURCE,
				playFromSource: true,
				id: `${info.owner_id}_${info.id}${info.access_key ? `_${info.access_key}` : ''}`,
				url: getSongDirectUrl({
					owner_id: info.owner_id.toString(),
					id: info.id.toString(),
					access_key: info.access_key,
				}),
				name: info.title,
				duration: info.duration,
				isLive: false,
				uploader: {
					name: info.artist,
				},
			},
			options
		)

		this.streamUrl = info.url
	}
}
