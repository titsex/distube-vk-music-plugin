import { getArtistAndSongs, getPlaylistAndSongs, getUserOrGroupSongs } from '../src/api'
import { VKMusicAPI, VKMusicAPIBool } from 'vk-music-api-wrapper'
import { beforeAll, describe, expect, test } from 'vitest'

describe('test api requests', async () => {
	let vk: VKMusicAPI

	beforeAll(() => {
		vk = new VKMusicAPI({
			token: process.env.TOKEN!,
		})
	})

	test('test getPlaylistAndSongs', async () => {
		const owner_id = '-192000782'
		const playlist_id = '406'

		const [playlist, songs] = await getPlaylistAndSongs(vk, {
			owner_id,
			playlist_id,
		})

		expect(playlist).not.toBeNull()
		expect(songs).toBeInstanceOf(Array)
	})

	test('test getArtistAndSongs', async () => {
		const artist_id = 'nepridymal_mty0oty4odm2mw'

		const [artist, songs] = await getArtistAndSongs(vk, {
			artist_id,
			extended: VKMusicAPIBool.TRUE,
		})

		expect(artist).not.toBeNull()
		expect(songs).toBeInstanceOf(Array)
	})

	describe('test getUserOrGroupSongs', () => {
		test('test user', async () => {
			const [owner_id, songs] = await getUserOrGroupSongs(vk, 'me11iodas')

			expect(owner_id).not.toBeNull()
			expect(songs).toBeInstanceOf(Array)
		})

		test('test group', async () => {
			const [owner_id, songs] = await getUserOrGroupSongs(vk, 'metalhammer80')

			expect(owner_id).not.toBeNull()
			expect(songs).toBeInstanceOf(Array)
		})
	})
})
