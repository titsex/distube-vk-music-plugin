import { fetchArtist, fetchArtistSongs } from '@api'
import { GuildMember } from 'discord.js'
import { convertSongs } from '@utils'
import { IVKArtist } from '@types'
import { Song } from 'distube'

type ArtistHandlerType = [artist: IVKArtist, songs: Song[]]

export default async function artistHandler(paramsList: string[], member: GuildMember): Promise<ArtistHandlerType> {
    const artist = await fetchArtist(paramsList[0])
    const songs = await fetchArtistSongs(artist.id)

    return [artist, convertSongs(songs, member)]
}
