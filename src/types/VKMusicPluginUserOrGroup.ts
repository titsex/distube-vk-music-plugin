import { Playlist as DistubePlaylist, type ResolveOptions } from 'distube'
import type { VKMusicPluginSong } from './VKMusicPluginSong'
import { VK_MUSIC_PLUGIN_SOURCE } from '../constant'

export class VKMusicPluginUserOrGroup<T> extends DistubePlaylist<T> {
	constructor(
		owner_id: string,
		url: string,
		songs: VKMusicPluginSong<T>[],
		options: ResolveOptions<T> = {}
	) {
		super(
			{
				songs,
				url,
				source: VK_MUSIC_PLUGIN_SOURCE,
				id: owner_id,
				name: owner_id,
			},
			options
		)
	}
}
