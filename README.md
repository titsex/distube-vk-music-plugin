# distube-vk-music-plugin
<div>
    <a href="https://nodei.co/npm/distube-vk-music-plugin">
        <img alt="npm peer dependency version" src="https://img.shields.io/npm/dependency-version/distube-vk-music-plugin/peer/distube?style=flat-square" />
    </a>
    <a href="https://nodei.co/npm/distube-vk-music-plugin">
        <img alt="npm" src="https://img.shields.io/npm/dt/distube-vk-music-plugin?logo=npm&style=flat-square">
    </a>
    <a href="https://github.com/titsex/distube-vk-music-plugin">
        <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/titsex/distube-vk-music-plugin?logo=github&logoColor=white&style=flat-square">
    </a>
</div>
Custom Distube plugin for VK Music support.

# Feature
| type         | example link                                    | ☑️ |
|--------------|-------------------------------------------------|----|
| playlist     | https://vk.com/music/playlist/-192000782_406    | ✅  |
| album        | https://vk.com/music/album/-2000892528_18892528 | ✅  |
| artist       | https://vk.com/artist/nepridymal_mty0oty4odm2mw | ✅  |
| audio        | https://vk.com/audio-2001624323_122624323       | ✅  |
| user audios  | https://vk.com/titsex                           | ✅  |
| group audios | https://vk.com/ne_pridymal_group                | ✅  |

# Installation
```
npm install distube-vk-music-plugin
yarn add distube-vk-music-plugin
pnpm add distube-vk-music-plugin
```

# Using
```ts
import { VKMusicPlugin } from 'distube-vk-music-plugin'
import { Client, GatewayIntentBits } from 'discord.js'
import { DisTube } from 'distube'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ]
})

const distube = new DisTube(client, {
    plugins: [new VKMusicPlugin({ token: 'vk token' })]
})

client.login('bot token')
```

# Example of plugin error handling
```ts
import { VK_PLUGIN_ERROR_CODE, VKMusicPluginErrors } from 'distube-vk-music-plugin'
import { DisTubeError } from 'distube'

client.on('error', (error) => {
    if (error instanceof DisTubeError) {
        if (error.errorCode === VK_PLUGIN_ERROR_CODE) {
            switch (error.message as VKMusicPluginErrors) {
                case VKMusicPluginErrors.PLAYLIST_NOT_FOUND:
                    // code here...
                    break
                case VKMusicPluginErrors.PLAYLIST_SONGS_NOT_FOUND:
                    // code here...
                    break
                case VKMusicPluginErrors.ARTIST_NOT_FOUND:
                    // code here...
                    break
                case VKMusicPluginErrors.ARTIST_SONGS_NOT_FOUND:
                    // code here...
                    break
                case VKMusicPluginErrors.AUDIO_NOT_FOUND:
                    // code here...
                    break
                case VKMusicPluginErrors.USER_OR_GROUP_NOT_FOUND:
                    // code here...
                    break
                case VKMusicPluginErrors.URL_NOT_SUPPORT:
                    // code here...
                    break
                case VKMusicPluginErrors.ACCESS_DENIED:
                    // code here...
                    break
                default:
                    // Unexpected errors, create an issue here: https://github.com/titsex/distube-vk-music-plugin/issues
                    break
            }
        }
    }
})
```

# Documentation
### VKMusicPlugin[VKMusicPluginOptions]
* ```token``` is required, to get it, follow the [link](https://oauth.vk.com/authorize?client_id=2685278&scope=65536&response_type=token&revoke=1), click "allow" and copy everything between access_token= and &expires_in
