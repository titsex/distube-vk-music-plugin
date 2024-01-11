import axios from 'axios'

import {
    IFetchVKPlaylistParams,
    IVKResolvedScreenName,
    VKMusicPluginErrors,
    RequestMethodType,
    IAudioGetResponse,
    VKAPIErrorCodes,
    IVKResponse,
    IVKPlaylist,
    IVKArtist,
    IVKGroup,
    IVKSong,
    IVKUser,
} from '@types'

import { VK_API_URL, VK_API_VERSION, VK_USER_AGENT } from '@constant'
import { VKMusicPlugin } from '@plugin'

export const api = axios.create({
    baseURL: VK_API_URL,
    timeout: 1500,
})

api.interceptors.request.use((config) => {
    config.url = config.url += `?v=${VK_API_VERSION}&access_token=${VKMusicPlugin.token}`
    config.headers['User-Agent'] = VK_USER_AGENT

    const params = config.params

    for (const param in params) {
        if (!param || !params[param]) continue
        config.url += `&${param}=${params[param]}`
    }

    return config
})

export async function makeRequest<T>(method: RequestMethodType, params: unknown) {
    const { data } = await api.get<IVKResponse<T>>(method, {
        params,
    })

    if (data.error?.error_code === VKAPIErrorCodes.ACCESS_DENIED) throw new Error(VKMusicPluginErrors.ACCESS_DENIED)
    if (data.error?.error_code === VKAPIErrorCodes.INVALID_PARAMS) throw new Error(VKMusicPluginErrors.URL_NOT_SUPPORT)

    return data.response
}

export async function fetchUserOrGroup(screen_name: string) {
    const response = await makeRequest<IVKResolvedScreenName>('utils.resolveScreenName', {
        screen_name,
    })

    if (Array.isArray(response)) throw new Error(VKMusicPluginErrors.USER_OR_GROUP_NOT_FOUND)
    if (!['user', 'group'].includes(response.type)) throw new Error(VKMusicPluginErrors.URL_NOT_SUPPORT)

    return response
}

export async function fetchUserInfo(user_id: number) {
    const response = await makeRequest<IVKUser[]>('users.get', {
        fields: 'photo_200',
        user_id,
    })

    return response[0]
}

export async function fetchGroupInfo(group_id: number) {
    const response = await makeRequest<{ groups: IVKGroup[] }>('groups.getById', {
        fields: 'photo_200',
        group_id,
    })

    return response.groups[0]
}

export async function fetchPlaylistInfo(params: IFetchVKPlaylistParams) {
    const response = await makeRequest<IVKPlaylist>('audio.getPlaylistById', params)

    if (!response) throw new Error(VKMusicPluginErrors.PLAYLIST_NOT_FOUND)

    return response
}

export async function fetchSong(audio: string) {
    const response = await makeRequest<IVKSong[]>('audio.getById', {
        audios: audio,
    })

    if (!response.length) throw new Error(VKMusicPluginErrors.AUDIO_NOT_FOUND)

    return response[0]
}

export async function fetchPlaylistSongs(params: IFetchVKPlaylistParams) {
    const queryParams = {
        offset: 0,
        ...params,
    }

    const audios: IVKSong[] = []

    const response = await makeRequest<IAudioGetResponse>('audio.get', queryParams)
    const totalAudiosCount = response.count

    audios.push(...response.items)
    queryParams.offset = audios.length

    while (totalAudiosCount > audios.length) {
        const response = await makeRequest<IAudioGetResponse>('audio.get', queryParams)

        audios.push(...response.items)
        queryParams.offset = audios.length
    }

    return audios
}

export async function fetchArtist(artist_id: string) {
    const response = await makeRequest<IVKArtist>('audio.getArtistById', {
        artist_id,
    })

    if (!response.name) throw new Error(VKMusicPluginErrors.ARTIST_NOT_FOUND)

    return response
}

export async function fetchArtistSongs(artist_id: string) {
    const queryParams = {
        offset: 0,
        artist_id,
    }

    const audios: IVKSong[] = []

    const response = await makeRequest<IAudioGetResponse>('audio.getAudiosByArtist', queryParams)
    const totalAudiosCount = response.count

    audios.push(...response.items)
    queryParams.offset = audios.length

    while (totalAudiosCount > audios.length) {
        const response = await makeRequest<IAudioGetResponse>('audio.getAudiosByArtist', queryParams)

        audios.push(...response.items)
        queryParams.offset = audios.length
    }

    return audios
}
