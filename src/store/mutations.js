import *  as type from './mutations-type'

const mutations = {
    [type.SET_MUSIC_LIST](state,musicList) {
        state.musicList = musicList
    }
}

export default mutations