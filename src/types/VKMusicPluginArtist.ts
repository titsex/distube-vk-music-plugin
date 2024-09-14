import { Playlist as DistubePlaylist, type ResolveOptions } from 'distube'
import type { VKMusicAudioArtist } from 'vk-music-api-wrapper'
import type { VKMusicPluginSong } from './VKMusicPluginSong'
import { VK_MUSIC_PLUGIN_SOURCE } from '../constant'

export class VKMusicPluginArtist<T> extends DistubePlaylist<T> {
	constructor(
		info: VKMusicAudioArtist,
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
				name: info.name,
				thumbnail: info?.photo?.at(-1)?.url || info?.group?.at(0)?.photo_200 || undefined,
			},
			options
		)
	}
}
