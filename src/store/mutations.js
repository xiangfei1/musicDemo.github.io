import *  as type from './mutations-type'

const mutations = {
    [type.SET_MUSIC_LIST](state,musicList) {
        state.musicList = musicList
    },
    [type.SET_TOP_LIST](state,toplist) {
        state.toplist = toplist
    }
}

export default mutations