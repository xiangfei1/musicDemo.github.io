<template>
  <div class="player" v-show="playList.length > 0">
    <!-- 正常播放 -->
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <!-- 背景 -->
        <div class="background">
          <div class="filter"></div>
          <img :src="currentSong.image" width="100%" height="100%" />
        </div>
        <!-- 头部 -->
        <div class="top">
          <div class="back" @click="back">
            <i class="iconfont icon-down"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <!-- 中间 -->
        <div class="middle" @click="changeMiddle">
          <!-- 光盘转动部分 -->
          <transition name="middleL">
            <div class="middle-l" v-show="currentShow === 'cd'">
              <div class="cd-wrapper">
                <div class="cd" :class="cdCls">
                  <img :src="currentSong.image" class="image" />
                </div>
              </div>
            </div>
          </transition>
          <!-- 歌词部分 -->
          <transition name="middleR">
            <Scroll
              ref="lyricList"
              v-show="currentShow === 'lyric'"
              class="middle-r"
              :data="currentLyric && currentLyric.lines"
            >
              <div class="lyric-wrapper">
                <div class="currentLyric" v-if="currentLyric">
                  <p
                    class="text"
                    :class="{ current: currentLineNum === index }"
                    ref="lyricLine"
                    v-for="(line, index) in currentLyric.lines"
                    :key="index"
                  >
                    {{ line.txt }}
                  </p>
                </div>
                <p class="no-lyric" v-if="currentLyric === null">
                  {{ upDateCurrentLyric }}
                </p>
              </div>
            </Scroll>
          </transition>
        </div>
        <!-- 底部 -->
        <div class="bottom">
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progressBar
                :percent="percent"
                @percentChange="percentChange"
                @percentChangeEnd="percentChangeEnd"
              ></progressBar>
            </div>
            <span class="time time-r">{{ format(duration) }}</span>
          </div>
          <!-- 按钮 -->
          <div class="operators">
            <div class="icon i-left">
              <i class="iconfont" :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left">
              <i class="iconfont icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center">
              <i class="iconfont" :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right">
              <i class="iconfont icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="iconfont" @click="saveFavoriteSong(currentSong)"  :class="changeFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-play" v-show="!fullScreen" @click.stop="open">
        <!-- 专辑图片 -->
        <div class="icon">
          <img :class="cdCls" :src="currentSong.image" width="40" height="40" />
        </div>
        <!-- 歌曲名称、歌手名 -->
        <div class="text">
          <h2 class="name">{{ currentSong.name }}</h2>
          <div class="desc">{{ currentSong.singer }}</div>
        </div>
        <!-- 播放按钮、及进度条 -->
        <div class="control" @click.stop="togglePlaying">
          <progressCircle :radius="radius" :percent="percent">
            <i class="iconfont" :class="miniIcon"></i>
          </progressCircle>
        </div>
        <!-- 播放列表 -->
        <div class="control">
          <i></i>
        </div>
      </div>
    </transition>
    <audio
      ref="audio"
      id="music-audio"
      @timeupdate="updateTime"
      autoplay
      @ended="end"
      @canplay="ready"
    ></audio>
  </div>
</template>

<script>
import Lyric from 'lyric-parser'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Scroll from 'subcomponents/scroll/scroll'
import { getLyric, getSong } from 'api/song'
import progressBar from 'subcomponents/progress-bar/progress-bar'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/utl'
import progressCircle from 'subcomponents/progress-circle/progress-circle'
export default {
  data() {
    return {
      currentShow: 'cd', //显示cd转盘还是歌词部分flag
      currentLyric: null, // 歌词部分
      noLyric: false, //判断歌词
      currentLineNum: 0, //歌词行数
      url: '', //歌曲播放链接
      currentTime: 0, //歌曲进度时间
      duration: 0, //歌曲总时间
      percent: 0, //歌曲进度百分比
      songReady: false, //判断歌曲是否准备
      radius: 32 //半径
    }
  },
  watch: {
    // 监听currentSong的变化
    currentSong(newVal, oldVal) {
      if (!newVal.id) {
        return
      }
      if (newVal.id === oldVal.id) {
        return
      }
      this.$refs.audio.pause()
      this.$refs.audio.currentTime = 0
      this._getSong(newVal.id)
    },
    // 监听url的变化
    url(newUrl) {
      this._getLyric(this.currentSong.id)
      this.$refs.audio.src = newUrl
      let stop = setInterval(() => {
        this.duration = this.$refs.audio.duration
        if (this.duration) {
          clearInterval(stop)
        }
      }, 150)
      this.setPlayingState(true)
    },
    currentTime() {
      this.percent = this.currentTime / this.duration
    }
  },
  computed: {
    // 判断是否有无歌词
    upDateCurrentLyric() {
      if (this.noLyric) {
        return '暂无歌词'
      }
      if (!this.noLyric) {
        return '歌词加载中'
      }
    },
    // 暂停或播放
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    // 更换播放模式
    iconMode() {
      if (this.mode === playMode.sequence) {
        return 'icon-seq'
      } else if (this.mode === playMode.loop) {
        return 'icon-loop'
      } else {
        return 'icon-random'
      }
    },
    // 暂停cd的转动动画
    cdCls() {
      return this.playing ? 'play' : 'play pause' //play pause 保存之前的状态，如果只是设置为pause，则会从初始位置转动
    },
    // mini播放按钮样式
    miniIcon() {
      return this.playing ? 'icon-mini-play' : 'icon-mini-stop'
    },
    ...mapGetters([
      'playList',
      'fullScreen',
      'currentSong',
      'playing',
      'mode',
      'sequenceList',
      'currentIndex',
      'favoriteList',
    ])
  },
  created() {
    this.move = false
  },
  methods: {
    back() {
      this.setFullScreen(false)
      this.currentShow = 'cd'
    },
    // cd动画点击事件
    changeMiddle() {
      if (this.currentShow == 'cd') {
        this.currentShow = 'lyric'
      } else {
        this.currentShow = 'cd'
      }
    },
    // 获取歌词
    _getLyric(id) {
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentLyric = null
      }
      this.noLyric = false //判断是否有歌词
      let _this = this
      getLyric(id)
        .then(res => {
          this.currentLyric = new Lyric(res.data.lrc.lyric, _this.handleLyric)
          if (_this.playing) {
            _this.currentLyric.play()
            _this.currentLineNum = 0
            _this.$refs.lyricList.scrollTo(0, 0, 1000)
          }
        })
        .catch(() => {
          _this.currentLyric = null
          _this.noLyric = true
          _this.currentLineNum = 0
        })
    },
    // 获取歌曲播放链接
    _getSong(id) {
      getSong(id).then(res => {
        this.url = res.data.data[0].url
      })
    },
    // 歌词滚动处理
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum
      // 大于五行就开始滚动
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      // this.currentLyric = txt
    },
    // 歌曲进度条的开始改变
    percentChange(percent) {
      this.move = true
      let currentTime = this.duration * percent
      this.currentTime = currentTime
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000) // 进度条跳转，歌词同样改变
      }
    },
    // 进度条结束改变
    percentChangeEnd(percent) {
      this.move = false
      let currentTime = this.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.$refs.audio.play()
        this.setPlayingState(true)
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    // 格式化歌曲时间
    format(interval) {
      interval = interval | 0
      let minute = (interval / 60) | 0
      let second = interval % 60 | 0
      if (second < 10) {
        second = '0' + second
      }
      return minute + ':' + second
    },
    // 更新歌曲时间
    updateTime(e) {
      if (this.move) {
        return
      }
      this.currentTime = e.target.currentTime
    },
    // 切换播放状态
    togglePlaying() {
      let audio = this.$refs.audio
      this.setPlayingState(!this.playing)
      this.playing ? audio.play() : audio.pause()
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    // 变更播放模式
    changeMode() {
      let mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.setPlayList(list)
      this._resetCurrentIndex(list)
    },
    // 重置歌曲索引
    _resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // 循环播放
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek()
      }
    },
    // 出错
    error() {
      this.songReady = true
    },
    // 准备歌曲
    ready() {
      // console.log(this.currentSong)
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    // 歌曲结束事件操作
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    // 上一首
    prev() {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.songReady = false
      }
    },
    // 下一首
    next() {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.songReady = false
      }
    },
    // 打开播放页面
    open() {
      // console.log(this.currentSong)
      this.setFullScreen(true)
    },
    // 收藏或者从收藏列表中删除
    changeFavoriteIcon(song) {
      if(this.isFavorite(song)) {
        return 'icon-del-like'
      } else {
        return 'icon-like'
      }
    },
    // 判断该歌曲是否已经在收藏列表
    isFavorite(song) {
      let index = this.favoriteList.findIndex((item)=>{
        return item.id === song.id
      })
      return index > -1
    },
    // 收藏歌曲
    saveFavoriteSong(song) {
      if(this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    ...mapActions([
      'savePlayHistory',
      'saveFavoriteList',
      'deleteFavoriteList'
    ]),
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAY_LIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
    })
  },
  components: {
    Scroll,
    progressBar,
    progressCircle
  }
}
</script>

<style lang="scss">
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
.player {
  // display: none;
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: -50%;
      top: -50%;
      width: 300%;
      height: 300%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(30px);
      .filter {
        position: absolute;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0.6;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 50;
        .iconfont {
          display: block;
          padding: 5px 9px;
          font-size: 35px;
          color: $color-theme-l;
        }
      }
      .title,
      .subtitle {
        width: 70%;
        margin: 0 auto;
        padding-top: 10px;
        line-height: 20px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        font-weight: bold;
        color: $color-text-l;
      }
      .subtitle {
        padding: 0;
        font-weight: normal;
        font-size: $font-size-small-x;
      }
    }
    .middle {
      display: flex;
      align-items: center;
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap; // 歌词显示
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        &.middleL-enter-active,
        &.middle-leave-active {
          transition: all 0.3s;
        }
        &.middleL-enter,
        &.middleL-leave-to {
          opacity: 0;
        }
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          .cd {
            position: absolute;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 15px solid rgba(225, 225, 225, 0.1);
            border-radius: 50%;
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
      }
      .middle-r {
        display: inline-block;
        position: absolute;
        top: 0;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        &.middleR-enter-active,
        &.middleR-leave-active {
          transition: all 0.2s;
        }
        &.middleR-enter,
        &.middleR-leave-to {
          opacity: 0;
        }
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 40px;
            color: $color-text-ggg;
            font-size: $font-size-medium;
            &.current {
              color: #fff;
            }
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        .time {
          color: $color-text-l;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme-l;
          i {
            font-size: 35px;
          }
          .mode {
            font-size: 25px;
          }
          &.i-left {
            text-align: right;
          }
          &.i-right {
            text-align: left;
            .icon-del-like {
              color: red;
            }
          }
          &.i-center {
            text-align: center;
            padding: 0 20px;
            i {
              font-size: 55px;
            }
          }
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.4s;
      .top,
      .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }
    &.normal-enter,
    &.normal-leave-to {
      opacity: 0;
    }
  }
  .mini-play {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: rgba(255, 255, 255, 1.85);
    &.mini-enter-active,
    &.mini-leave-active {
      transition: all 0.4s;
    }
    &.mini-enter,
    &.mini-leave-to {
      opacity: 0;
    }
    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;
      img {
        border-radius: 50%;
        &.play {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      overflow: hidden;
      .name {
        margin-bottom: 2px;
        line-height: 14px;
        text-overflow: ellipsis;
        overflow: hidden;
        @include no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }
      .desc {
        text-overflow: ellipsis;
        overflow: hidden;
        @include no-wrap();
        font-size: $font-size-small;
        color: $color-text;
      }
    }
    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      .iconfont {
        position: relative;
        left: -5px;
        top: -3px;
      }
      .icon-mini-play {
        color: $color-theme-d;
        font-size: 22px;
        position: absolute;
        left: 6px;
        top: 5px;
      }
      .icon-mini-stop {
        color: $color-theme-d;
        font-size: 18px;
        position: absolute;
        left: 7px;
        top: 8px;
      }
    }
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
