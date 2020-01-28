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
                <div class="cd">
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
          <!-- <audio ref="audio"></audio> -->
        </div>
        <!-- 底部 -->
        <div class="bottom">
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">0:00</span>
            <div class="progress-bar-wrapper">
              <progressBar></progressBar>
            </div>
            <span class="time time-r">0:00</span>
          </div>
          <!-- 按钮 -->
          <div class="operators">
            <div class="icon i-left">
              <i class="iconfont icon-seq"></i>
            </div>
            <div class="icon i-left">
              <i class="iconfont icon-prev"></i>
            </div>
            <div class="icon i-center">
              <i class="iconfont icon-play"></i>
            </div>
            <div class="icon i-right">
              <i class="iconfont icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="iconfont icon-like"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Lyric from 'lyric-parser'
import { mapGetters, mapMutations } from 'vuex'
import Scroll from 'subcomponents/scroll/scroll'
import { getLyric, getSong } from 'api/song'
import progressBar from 'subcomponents/progress-bar/progress-bar'
export default {
  data() {
    return {
      currentShow: 'cd', //显示cd转盘还是歌词部分flag
      currentLyric: null, //判断是否有歌词
      noLyric: false, //判断歌词
      currentLineNum: 0, //歌词行数
      url: '' //歌曲播放链接
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
      this._getSong(newVal.id)
      this._getLyric(this.currentSong.id)
    },
    // 监听url的变化
    url(newUrl, oldUrl) {
      this._getLyric(this.currentSong.id)
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
    ...mapGetters(['playList', 'fullScreen', 'currentSong', 'playing'])
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
      this.noLyric = false
      let _this = this
      getLyric(id)
        .then(res => {
          let lyric = new Lyric(res.data.lrc.lyric, _this.handleLyric)
          if (_this.playing) {
            _this.currentLyric = lyric
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
        console.log(res.data)
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
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'
    })
  },
  components: {
    Scroll,
    progressBar
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
        display: flex;
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
            font-size: 45px;
          }
          .mode {
            font-size: 25px;
          }
          &.i-left {
            text-align: right;
          }
          &.i-right {
            text-align: left;
          }
          &.i-center {
            text-align: center;
            padding: 0 20px;
            i {
              font-size: 50px;
            }
          }
        }
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
