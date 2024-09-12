import type { VKMusicAPI, VKMusicAudioGetMethodParams } from 'vk-music-api-wrapper'

export class VKMusicPlaylist {
	constructor(private readonly vk: VKMusicAPI) {}

	async getAllSongs(params: VKMusicAudioGetMethodParams) {
		let offset = 0

		let response = await this.vk.audio.get({
			...params,
			offset,
		})

		const songs = []
		const totalSongsCount = response.count

		songs.push(...response.items)
		offset += songs.length

		while (totalSongsCount > songs.length) {
			response = await this.vk.audio.get({
				...params,
				offset,
			})

			songs.push(...response.items)
			offset += songs.length
		}

		return songs
	}
}
