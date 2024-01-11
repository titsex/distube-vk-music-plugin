import { VKMusicPluginOptions, VKMusicPluginResolveOptions, VKMusicPluginErrors, IVKUser, IVKGroup } from '@types'
import { fetchGroupInfo, fetchPlaylistSongs, fetchSong, fetchUserInfo, fetchUserOrGroup } from '@api'
import { parseSongParams, getLinkType, getParamsByURL, parseURL, convertSongs } from '@utils'
import { DisTubeError, ExtractorPlugin, Playlist, Song } from 'distube'
import { VK_PLUGIN_ERROR_CODE, VK_PLUGIN_SOURCE } from '@constant'
import { artistHandler, playlistHandler } from '@handlers'

class VKMusicPlugin extends ExtractorPlugin {
    public static token: string

    constructor(options: VKMusicPluginOptions) {
        super()

        if (typeof options !== 'object' || Array.isArray(options))
            throw new DisTubeError('INVALID_TYPE', ['object', 'undefined'], options, 'VKMusicPluginOptions')

        VKMusicPlugin.token = options.token
    }

    override async validate(url: string): Promise<boolean> {
        return url.includes('vk.com')
    }

    override async resolve<T>(url: string, options: VKMusicPluginResolveOptions): Promise<Playlist<T> | Song<T>> {
        url = parseURL(url)

        const linkType = getLinkType(url)
        const paramsList = getParamsByURL(url, linkType)

        try {
            if (linkType === 'playlist') {
                const [playlist, songs] = await playlistHandler(paramsList, options.member!)

                return new Playlist({
                    url,
                    name: playlist.title,
                    source: VK_PLUGIN_SOURCE,
                    songs,
                    thumbnail: playlist.photo.photo_1200,
                })
            }

            if (linkType === 'artist') {
                const [artist, songs] = await artistHandler(paramsList, options.member!)

                return new Playlist({
                    url,
                    name: artist.name,
                    source: VK_PLUGIN_SOURCE,
                    songs,
                    thumbnail: 'groups' in artist ? artist.groups![0].photo_200 : '',
                })
            }

            if (linkType === 'audio') {
                const audio = await fetchSong(parseSongParams(paramsList))

                return new Song({
                    url: audio.url,
                    name: `${audio.artist} - ${audio.title}`,
                    member: options.member,
                    src: VK_PLUGIN_SOURCE,
                    duration: audio.duration,
                })
            }

            const { object_id: id, type } = await fetchUserOrGroup(paramsList[0])

            const info = type === 'user' ? await fetchUserInfo(id) : await fetchGroupInfo(id)
            const songs = await fetchPlaylistSongs({ owner_id: `${type === 'user' ? '' : '-'}${id}` })

            let name: string

            if (type === 'user') {
                const userInfo = info as IVKUser
                name = `${userInfo.first_name} ${userInfo.last_name}`
            } else {
                const groupInfo = info as IVKGroup
                name = groupInfo.name
            }

            return new Playlist({
                url,
                name,
                source: VK_PLUGIN_SOURCE,
                songs: convertSongs(songs, options.member),
                thumbnail: info.photo_200,
            })
        } catch (error) {
            throw new DisTubeError(VK_PLUGIN_ERROR_CODE, error.message)
        }
    }
}

export { VKMusicPlugin, VKMusicPluginErrors, VK_PLUGIN_ERROR_CODE }
