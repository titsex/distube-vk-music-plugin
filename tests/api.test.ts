import {
	fetchRelatedSongs,
	fetchSong,
	getArtistAndSongs,
	getPlaylistAndSongs,
	getUserOrGroupSongs,
} from '../src/api'

import { VKMusicAPI, VKMusicAPIBool } from 'vk-music-api-wrapper'
import { beforeAll, describe, expect, test } from 'vitest'
import { VKMusicPluginErrors } from '../src/types'

describe('test api requests', async () => {
	let vk: VKMusicAPI

	beforeAll(() => {
		vk = new VKMusicAPI({
			token: process.env.VK_API_TOKEN!,
		})
	})

	describe('test getPlaylistAndSongs', () => {
		test('test correct playlist', async () => {
			const owner_id = '-192000782'
			const playlist_id = '406'

			const [playlist, songs] = await getPlaylistAndSongs(vk, {
				owner_id,
				playlist_id,
			})

			expect(playlist).not.toBeNull()
			expect(songs).toBeInstanceOf(Array)
		})
		test('test incorrect playlist', async () => {
			const owner_id = '-9999999999'
			const playlist_id = '99999999'

			await expect(
				getPlaylistAndSongs(vk, {
					owner_id,
					playlist_id,
				})
			).rejects.toThrowError(VKMusicPluginErrors.PLAYLIST_NOT_FOUND)
		})
		test('test empty playlist', async () => {
			const owner_id = '-227427976'
			const playlist_id = '1'

			await expect(
				getPlaylistAndSongs(vk, {
					owner_id,
					playlist_id,
				})
			).rejects.toThrowError(VKMusicPluginErrors.PLAYLIST_SONGS_NOT_FOUND)
		})
	})

	describe('test getArtistAndSongs', () => {
		test('test correct artist', async () => {
			const artist_id = 'nepridymal_mty0oty4odm2mw'

			const [artist, songs] = await getArtistAndSongs(vk, {
				artist_id,
				extended: VKMusicAPIBool.TRUE,
			})

			expect(artist).not.toBeNull()
			expect(songs).toBeInstanceOf(Array)
		})
		test('test incorrect artist', async () => {
			const artist_id = 'nepridymal_mty0oty4odm2mw_incorrect'

			await expect(
				getArtistAndSongs(vk, {
					artist_id,
					extended: VKMusicAPIBool.TRUE,
				})
			).rejects.toThrowError(VKMusicPluginErrors.ARTIST_NOT_FOUND)
		})
	})

	describe('test getUserOrGroupSongs', () => {
		describe('test user', () => {
			test('test correct user', async () => {
				const [owner_id, songs] = await getUserOrGroupSongs(vk, 'titsex')

				expect(owner_id).not.toBeNull()
				expect(songs).toBeInstanceOf(Array)
			})
			test('test incorrect user', async () => {
				await expect(getUserOrGroupSongs(vk, 'titsextitsex')).rejects.toThrowError(
					VKMusicPluginErrors.USER_OR_GROUP_NOT_FOUND
				)
			})
		})

		describe('test group', () => {
			test('test correct group', async () => {
				const [owner_id, songs] = await getUserOrGroupSongs(vk, 'metalhammer80')

				expect(owner_id).not.toBeNull()
				expect(songs).toBeInstanceOf(Array)
			})
			test('test incorrect group', async () => {
				await expect(
					getUserOrGroupSongs(vk, 'metalhammer80metalhammer80')
				).rejects.toThrowError(VKMusicPluginErrors.USER_OR_GROUP_NOT_FOUND)
			})
		})
	})

	describe('test fetchSong', () => {
		test('test correct song', async () => {
			const owner_id = '-2001624323'
			const id = '122624323'

			const song = await fetchSong(vk, {
				owner_id,
				id,
			})

			expect(song.id.toString()).toEqual(id)
			expect(song.owner_id.toString()).toEqual(owner_id)
		})
		test('test incorrect song', async () => {
			const owner_id = '-0000000000'
			const id = '000000000'

			await expect(fetchSong(vk, { owner_id, id })).rejects.toThrowError(
				VKMusicPluginErrors.URL_NOT_SUPPORT
			)
		})
	})

	test('test fetchRelatedSongs', async () => {
		const owner_id = '-2001624323'
		const id = '122624323'

		const songs = await fetchRelatedSongs(
			vk,
			{
				owner_id,
				id,
			},
			10
		)

		expect(songs).toBeInstanceOf(Array)
		expect(songs.length).toBeGreaterThan(0)
	})
})
