import {
	VKMusicPluginArtist,
	VKMusicPluginPlaylist,
	VKMusicPluginSong,
	VKMusicPluginUserOrGroup,
} from '../src/types'

import { beforeAll, describe, test, expect } from 'vitest'
import { VKMusicPlugin } from '../src/plugin'

describe('test plugin', async () => {
	let plugin: VKMusicPlugin

	beforeAll(() => {
		plugin = new VKMusicPlugin({
			token: process.env.TOKEN!,
		})
	})

	test('test plugin initialization', () => {
		expect(plugin).not.toBeNull()
	})

	test('test validate method', () => {
		const isValidURL = plugin.validate('https://vk.com/titsex')

		expect(isValidURL).toBeTruthy()
	})

	describe('test resolve method', () => {
		describe('test playlist/album url', () => {
			test('test playlist url', async () => {
				const url = 'https://vk.com/music/playlist/-192000782_406'

				const response = await plugin.resolve(url, {})

				expect(response).toBeInstanceOf(VKMusicPluginPlaylist)
			})

			test('test album url', async () => {
				const url = 'https://vk.com/music/album/-2000892528_18892528'

				const response = await plugin.resolve(url, {})

				expect(response).toBeInstanceOf(VKMusicPluginPlaylist)
			})
		})

		test('test artist url', async () => {
			const url = 'https://vk.com/artist/nepridymal_mty0oty4odm2mw'

			const response = await plugin.resolve(url, {})

			expect(response).toBeInstanceOf(VKMusicPluginArtist)
		})

		describe('test user/group url', () => {
			test('test user url', async () => {
				const url = 'https://vk.com/me11iodas'

				const response = await plugin.resolve(url, {})

				expect(response).toBeInstanceOf(VKMusicPluginUserOrGroup)
			})

			test('test group url', async () => {
				const url = 'https://vk.com/metalhammer80'

				const response = await plugin.resolve(url, {})

				expect(response).toBeInstanceOf(VKMusicPluginUserOrGroup)
			})
		})

		test('test song url', async () => {
			const url = 'https://vk.com/audio-2001624323_122624323'

			const response = await plugin.resolve(url, {})

			expect(response).toBeInstanceOf(VKMusicPluginSong)
		})
	})

	test('test getRelatedSongs method', async () => {
		const song = {
			id: '-28905875_456281396_5087a041bc10bd334c',
		} as VKMusicPluginSong<{}>

		const response = await plugin.getRelatedSongs(song)

		expect(response).toBeInstanceOf(Array)
		expect(response[0]).toBeInstanceOf(VKMusicPluginSong)
	})

	test('test getStreamURL method', async () => {
		const url = 'https://vk.com/audio-2001624323_122624323'

		const song = {
			url,
		} as VKMusicPluginSong<{}>

		const response = plugin.getStreamURL(song)

		expect(response).toEqual(url)
	})
})
