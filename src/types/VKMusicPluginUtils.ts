export enum VKMusicPluginErrors {
	PLAYLIST_NOT_FOUND = 'The playlist on the specified link was not found',
	ARTIST_NOT_FOUND = 'The artist for the specified query was not found',
	AUDIO_NOT_FOUND = 'Audio on the specified link was not found',
	USER_OR_GROUP_NOT_FOUND = 'The user or community you specified was not found',
	URL_NOT_SUPPORT = 'Invalid link format. You can specify links to playlists, albums, artists, users, communities and songs',
	ACCESS_DENIED = 'The user or the community has no access to audio',
}

export type LinkType = 'playlist' | 'audio' | 'userOrGroup' | 'artist'

export interface VKMusicPluginOptions {
	token: string
}
