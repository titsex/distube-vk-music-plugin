import { GuildMember } from 'discord.js'

export enum VKMusicPluginErrors {
    PLAYLIST_NOT_FOUND = 'The playlist on the specified link was not found',
    AUDIO_NOT_FOUND = 'Audio on the specified link was not found',
    PLAYLIST_SONGS_NOT_FOUND = 'Audio in the playlist at the specified link was not found',
    ARTIST_NOT_FOUND = 'The artist for the specified query was not found',
    ARTIST_SONGS_NOT_FOUND = 'No audio was found for the specified artist',
    USER_OR_GROUP_NOT_FOUND = 'The user or community you specified was not found',
    URL_NOT_SUPPORT = 'Invalid link format. You can specify links to playlists, albums, artists, users, communities and songs',
    ACCESS_DENIED = 'The user or the community has no access to audio',
}

export enum VKAPIErrorCodes {
    ACCESS_DENIED = 201,
    INVALID_PARAMS = 100,
}

export type RequestMethodType =
    | 'audio.getPlaylistById'
    | 'audio.getById'
    | 'audio.get'
    | 'audio.getArtistById'
    | 'audio.getAudiosByArtist'
    | 'users.get'
    | 'groups.getById'
    | 'utils.resolveScreenName'

export type ResolvedVKScreenNameType = 'user' | 'group' | string

export type LinkType = 'playlist' | 'audio' | 'userOrGroup' | 'artist'

export interface IVKError {
    error_code: number
    error_msg: string
}

export interface IVKResponse<T> {
    response: T
    error?: IVKError
}

export interface IVKUser {
    id: number
    photo_200: string
    first_name: string
    last_name: string
}

export interface IVKGroup {
    id: number
    name: string
    screen_name: string
    photo_200: string
}

export interface IVKPlaylist {
    id: number
    owner_id: number
    title: string
    description: string
    count: number
    photo: IVKPlaylistPhoto
}

export interface IVKPlaylistPhoto {
    width: number
    height: number
    photo_34: string
    photo_68: string
    photo_135: string
    photo_270: string
    photo_300: string
    photo_600: string
    photo_1200: string
}

export interface IVKSong {
    artist: string
    id: number
    owner_id: number
    title: string
    duration: number
    access_key: string
    url: string
}

export interface IVKArtist {
    name: string
    domain: string
    id: string
    groups?: IVKArtistGroup[]
}

export interface IVKArtistGroup {
    id: string
    name: string
    screen_name: string
    photo_50: string
    photo_100: string
    photo_200: string
}

export interface IVKResolvedScreenName {
    object_id: number
    type: ResolvedVKScreenNameType
}

export interface IAudioGetResponse {
    items: IVKSong[]
    count: number
}

export interface VKMusicPluginOptions {
    token: string
}

export interface VKMusicPluginResolveOptions {
    member?: GuildMember
    metadata?: unknown
}

export interface IFetchVKPlaylistParams {
    owner_id: string
    album_id?: string
    playlist_id?: string
    id?: string
    access_key?: string
}

export interface IFetchVKAudioParams {
    owner_id: string
    id: string
    access_key?: string
}
