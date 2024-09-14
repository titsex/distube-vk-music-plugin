import { Playlist as DistubePlaylist, type ResolveOptions } from 'distube'
import type { VKMusicAudioPlaylist } from 'vk-music-api-wrapper'
import type { VKMusicPluginSong } from './VKMusicPluginSong'
import { VK_MUSIC_PLUGIN_SOURCE } from '../constant'

export class VKMusicPluginPlaylist<T> extends DistubePlaylist<T> {
	constructor(
		info: VKMusicAudioPlaylist,
		url: string,
		songs: VKMusicPluginSong<T>[],
		options: ResolveOptions<T> = {}
	) {
		super(
			{
				songs,
				url,
				source: VK_MUSIC_PLUGIN_SOURCE,
				id: info.id.toString(),
				name: info.title,
				thumbnail: info?.photo?.photo_1200,
			},
			options
		)
	}
}
