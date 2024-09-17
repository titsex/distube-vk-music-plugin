export * from './VKMusicPluginUserOrGroup'
export * from './VKMusicPluginPlaylist'
export * from './VKMusicPluginArtist'
export * from './VKMusicPluginSong'

export enum VKMusicPluginErrors {
	PLAYLIST_NOT_FOUND = 'The playlist on the specified link was not found',
	PLAYLIST_SONGS_NOT_FOUND = 'There are no songs in the playlist at the specified link',
	ARTIST_NOT_FOUND = 'The artist for the specified query was not found',
	ARTIST_SONGS_NOT_FOUND = 'The artist does not have any songs on the specified link',
	SONG_NOT_FOUND = 'Song on the specified link was not found',
	SONG_STREAM_URL_NOT_FOUND = 'The song stream url was not found',
	USER_OR_GROUP_NOT_FOUND = 'The user or community you specified was not found',
	USER_SONGS_NOT_FOUND = "The user's songs were not found at the specified link",
	GROUP_SONGS_NOT_FOUND = "The group's songs were not found at the specified link",
	URL_NOT_SUPPORT = 'Invalid link format. You can specify links to playlists, albums, artists, users, communities and songs',
}

export type LinkType = 'playlist' | 'song' | 'artist' | 'userOrGroup'

export interface VKMusicPluginOptions {
	/**
	 * @name token
	 * @description To get it, follow the https://oauth.vk.com/authorize?client_id=2685278&scope=65536&response_type=token&revoke=1, click "allow" and copy everything between access_token= and &expires_in
	 */
	token: string
}
