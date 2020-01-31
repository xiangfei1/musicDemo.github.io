const PLAY_KEY = '__play__' //设置本地歌曲缓存的key
const PLAY_MAX_LENGTH = 200 //设置播放记录的最大值
import storage from 'good-storage'

function insertArray(arr,val,maxLen) {
    let index = arr.findIndex(val.id)
    if(index === 0) {
        return
    }
    if(index > 0) {
        arr.splice(index,1)
    }
    arr.unshift(val)
    if(arr.length > maxLen) {
        arr.pop()
    }
}

export function savePlay(song) {
    let songs = storage.get(PLAY_KEY)
    this.insertArray(songs,song,PLAY_MAX_LENGTH)
    storage.set(PLAY_KEY,songs)
    return songs
}

// 获取播放缓存
export function loadPlay() {
    return storage.get(PLAY_KEY,[])
}