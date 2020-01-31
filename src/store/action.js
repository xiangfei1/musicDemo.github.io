import * as types from './mutations-type'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/utl'
import { savePlay } from '../common/js/cache'

function findIndex(list, song) {
  return list.findIndex(item => {
    // 这个findIndex为数组的方法，根据条件返回索引值
    return item.id === song.id
  })
}

// 点击播放
export const selectPlay = function({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list) //顺序播放列表
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList) //随机播放列表
    index = findIndex(randomList, list[index]) //得到随机产生的索引值
  } else {
    commit(types.SET_PLAY_LIST, list) //正常播放
  }
  commit(types.SET_CURRENT_INDEX, index) //匹配正在播放歌曲的索引值
  commit(types.SET_FULL_SCREEN, true) //点击歌曲是否显示播放页面
  commit(types.SET_PLAYING_STATE, true) //是否播放
}

// 保存播放历史
export const savePlayHistory = function({commit},song) {
  commit(types.SET_PLAY_HISTORY,savePlay(song))
}
