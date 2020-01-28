export const musicList = state => state.musicList

export const topList = state => state.topList

export const singer = state => state.singer

export const playList = state => state.playList

export const fullScreen = state => state.fullScreen

export const playing = state => state.playing

export const currentSong = (state) => {
    return state.playList[state.currentIndex] || {}
}