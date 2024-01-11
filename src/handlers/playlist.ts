import { IFetchVKPlaylistParams, IVKPlaylist } from '@types'
import { fetchPlaylistInfo, fetchPlaylistSongs } from '@api'
import { GuildMember } from 'discord.js'
import { convertSongs } from '@utils'
import { Song } from 'distube'

type PlaylistHandlerType = [playlist: IVKPlaylist, songs: Song[]]

export default async function playlistHandler(paramsList: string[], member: GuildMember): Promise<PlaylistHandlerType> {
    const params: IFetchVKPlaylistParams = {
        owner_id: paramsList[0],
        playlist_id: paramsList[1],
        album_id: paramsList[1],
    }

    if (paramsList[2]) params.access_key = paramsList[2]

    const playlist = await fetchPlaylistInfo(params)
    const songs = await fetchPlaylistSongs(params)

    return [playlist, convertSongs(songs, member)]
}
