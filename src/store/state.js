import {playMode} from 'common/js/config'
import {loadPlay} from 'common/js/cache'
const state = {
    musicList: {},   //歌单列表
    topList: {}, //排行榜列表
    singer: {}, //歌手
    mode: playMode.sequence,    //播放模式，默认循序播放
    sequenceList: [],   //顺序列表
    playList: [],   //播放列表
    currentIndex: -1,   //当前播放索引
    fullScreen: false,  //是否全屏
    playing: false, //播放
    playHistory: loadPlay(),    //获取播放缓存
    favoriteList: {},   //喜欢的歌曲列表
}

export default state