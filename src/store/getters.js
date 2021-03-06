export const musicList = state => state.musicList

export const topList = state => state.topList

export const singer = state => state.singer

export const playList = state => state.playList

export const fullScreen = state => state.fullScreen

export const playing = state => state.playing

export const mode = state => state.mode

export const sequenceList = state => state.sequenceList

export const currentIndex = state => state.currentIndex

export const favoriteList = state => state.favoriteList

export const playHistory = state => state.playHistory

export const searchHistory = state => state.searchHistory

export const currentSong = (state) => {
    return state.playList[state.currentIndex] || {}
}