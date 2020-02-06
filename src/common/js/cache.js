const PLAY_KEY = '__play__' //设置本地歌曲缓存的key
const PLAY_MAX_LENGTH = 200 //设置播放记录的最大值

const FAVORITE_KEY = '__favorite__' //设置喜欢歌曲的key
const FAVORITE_MAX_LENGTH = 200 //设置喜欢歌曲的最大保存值

const QUERY_KEY = '__query__' //设置搜索缓存
const QUERY_MAX_LENGTH = 50 //设置搜索记录缓存最大值
import storage from 'good-storage' //缓存插件

function insertArray(arr, val, compare, maxLen) {
  let index = arr.findIndex(compare) //寻找本地是否已经保存了歌曲，如果compare中返回结果为true，则findIndex返回歌曲索引
  if (index === 0) {
    //如果本地已有该歌曲且索引为0，则不需要进行更新操作
    return
  }
  if (index > 0) {
    //如果索引大于0，即不为第一，则先根据歌曲索引删除歌曲，然后在将歌曲添加到索引为0的位置
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (arr.length > maxLen) {
    //如果播放记录大于maxLen，则删除最先开始听的歌曲
    arr.pop()
  }
}

function deleteArray(arr, compare) {
  let index = arr.findIndex(compare)
  if (index === -1) {
    return
  }
  arr.splice(index, 1)
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  // console.log(songs)
  let compare = item => {
    //回调函数，返回布尔值
    return item.id === song.id
  }
  insertArray(songs, song, compare, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  let compare = item => {
    return item.id === song.id
  }
  insertArray(songs, song, compare, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 从收藏列表中删除歌曲
export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  let compare = item => {
    return item.id === song.id
  }
  deleteArray(songs, compare)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 获取播放缓存
export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

//获取喜欢歌曲缓存
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}

// 保存搜索历史
export function saveHistory(query) {
  let querys = storage.get(QUERY_KEY, [])
  let compare = item => {
    return item === query
  }
  insertArray(querys, query, compare, QUERY_MAX_LENGTH)
  storage.set(QUERY_KEY, querys)
  return querys
}

// 获取搜索历史
export function loadHistory() {
  return storage.get(QUERY_KEY, [])
}

// 删除所有搜索历史
export function deleteAllHistory() {
  return storage.set(QUERY_KEY, [])
}

// 删除指定记录
export function deleteOneHistory(query) {
  let querys = storage.get(QUERY_KEY,[])
  let compare = item => {
    return item === query
  }
  deleteArray(querys,compare)
  storage.set(QUERY_KEY,querys)
  return querys
}
