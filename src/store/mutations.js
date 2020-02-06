import *  as type from './mutations-type'

const mutations = {
    [type.SET_MUSIC_LIST](state,musicList) {
        state.musicList = musicList
    },
    [type.SET_TOP_LIST](state,topList) {
        state.topList = topList
    },
    [type.SET_SINGER](state,singer) {
        state.singer = singer
    },
    [type.SET_SEQUENCE_LIST](state,list) {
        state.sequenceList = list
    },
    [type.SET_PLAY_LIST](state,list) {
        state.playList = list
    },
    [type.SET_CURRENT_INDEX](state,index) {
        state.currentIndex = index
    },
    [type.SET_FULL_SCREEN](state,flag) {
        state.fullScreen = flag
    },
    [type.SET_PLAYING_STATE](state,flag) {
        state.playing = flag
    },
    [type.SET_PLAY_MODE](state,mode) {
        state.mode = mode
    },
    [type.SET_PLAY_HISTORY](state,playHistory) {
        state.playHistory = playHistory
    },
    [type.SET_FAVORITE_LIST](state,favoriteList) {
        state.favoriteList = favoriteList
    },
    [type.SET_SEARCH_HISTORY](state,searchHistory) {
        state.searchHistory = searchHistory
    }
}

export default mutations