import {
    IS_ARTIST_REGEX,
    IS_AUDIO_REGEX,
    IS_PLAYLIST_OR_ALBUM_REGEX,
    IS_USER_OR_GROUP_REGEX,
    VK_PLUGIN_SOURCE,
} from '@constant'

import { IFetchVKAudioParams, IVKSong, LinkType } from '@types'
import { GuildMember } from 'discord.js'
import { Song } from 'distube'

export function getLinkType(url: string): LinkType {
    if (IS_PLAYLIST_OR_ALBUM_REGEX.test(url)) return 'playlist'
    if (IS_ARTIST_REGEX.test(url)) return 'artist'
    if (IS_AUDIO_REGEX.test(url)) return 'audio'

    return 'userOrGroup'
}

export function parseURL(url: string): string {
    return url.replace(/http(?:s|):\/\/(?:m\.|)vk\.com\//i, '').replace('%2F', '')
}

export function getParamsByURL(url: string, type: LinkType): string[] {
    if (type === 'playlist') return url.match(IS_PLAYLIST_OR_ALBUM_REGEX)!.slice(1, 4)
    if (type === 'artist') return url.match(IS_ARTIST_REGEX)!.slice(1, 2)
    if (type === 'audio') return url.match(IS_AUDIO_REGEX)!.slice(1, 4)

    return url.match(IS_USER_OR_GROUP_REGEX)!.slice(1, 2)
}

export function parseSongParams(paramsList: string[]): string {
    const params: IFetchVKAudioParams = {
        owner_id: paramsList[0],
        id: paramsList[1],
    }

    if (paramsList[2]) params.access_key = paramsList[2]

    return `${params.owner_id}_${params.id}${params.access_key ? `_${params.access_key}` : ''}`
}
export function convertSongs(songs: IVKSong[], member?: GuildMember): Song[] {
    return songs.map(
        (song: IVKSong) =>
            new Song({
                name: `${song.artist} - ${song.title}`,
                src: VK_PLUGIN_SOURCE,
                duration: song.duration,
                url: song.url,
                member,
            })
    )
}
