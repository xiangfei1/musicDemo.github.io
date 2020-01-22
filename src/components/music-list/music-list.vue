<template>
  <transition name="slide">
    <div class="music-list">
      <!-- 头部 -->
      <div class="header" ref="header">
        <div class="back" @click="back">
          <i class="iconfont icon-back"></i>
        </div>
        <div class="text">
          {{ headerTitle }}
        </div>
      </div>
      <!-- 滚动歌单 -->
      <Scroll
        ref="list"
        class="list"
        :listenScroll="listenScroll"
        :probeType="probeType"
        :data="listDetail"
        @scroll="scroll"
      >
        <div class="music-list-wrapper">
          <!-- 歌单背景 -->
          <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="text">
              <h2 class="list-title">{{ title }}</h2>
              <p class="play-count">
                <i class="iconfont icon-listen"></i>
                {{ playCount }}
              </p>
            </div>
          </div>
          <!-- 歌单 -->
          <div class="song-list-wrapper">
            <!-- 播放按钮 -->
            <div class="sequence-play">
              <i class="iconfont icon-play"></i>
              <span class="text">播放全部</span>
              <span class="count">(共{{ listDetail.length }}首)</span>
            </div>
            <!-- 歌曲列表 -->
            <SongList :songs="listDetail"></SongList>
          </div>
        </div>
      </Scroll>
    </div>
  </transition>
</template>

<script>
import Scroll from 'subcomponents/scroll/scroll'
import { mapGetters } from 'vuex'
import { getRecommendListDetail } from 'api/recommend'
import { ERR_OK } from 'common/js/config'
import { createRecommendListSong } from 'common/js/song'
import SongList from 'subcomponents/song-list/song-list'
export default {
  data() {
    return {
      headerTitle: '歌单',
      listDetail: [], //歌单列表
      scrollY: 0
    }
  },
  created() {
    this._getRecommendListDetail(this.musicList.id)
    this.listenScroll = true
    this.probeType = 3
  },
  computed: {
    // 播放量
    playCount() {
      if (!this.musicList.playCount) return
      if (this.musicList.playCount < 1e5) {
        return Math.floor(this.musicList.playCount)
      } else {
        return Math.floor(this.musicList.playCount / 10000) + '万'
      }
    },
    //  背景
    bgStyle() {
      return `background-image: url(${this.musicList.picUrl})`
    },
    // 歌单名
    title() {
      return this.musicList.name
    },
    // 状态管理Vuex
    ...mapGetters(['musicList'])
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    },
    // 获取歌单数据
    _getRecommendListDetail(id) {
      if (!id) {
        this.$router.push('/recommend')
        return
      }
      let _this = this
      getRecommendListDetail(id).then(res => {
        if (res.status == ERR_OK) {
          _this.listDetail = res.data.playlist.tracks.map(item => {
            return createRecommendListSong(item)
          })
        } else {
          alert('获取失败')
        }
      })
    }
  },
  components: {
    Scroll,
    SongList
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s;
}
.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translate3d(30%, 0, 0);
}
.music-list {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
  .header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 44px;
    color: #fff;
    z-index: 100;
    .back {
      position: absolute;
      top: 6px;
      left: 0px;
      .icon-back {
        padding: 5px 5px;
        font-size: 30px;
      }
    }
    .text {
      position: absolute;
      left: 35px;
      line-height: 44px;
      font-size: $font-size-medium-x;
      @include no-wrap();
    }
  }
  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;
    .music-list-wrapper {
      .bg-image {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 75%;
        transform-origin: top;
        background-size: cover;
        background-position: 0 30%;
        .text {
          position: absolute;
          left: 15px;
          bottom: 50px;
          color: #fff;
          height: 40px;
          width: 80%;
          .list-title {
            position: absolute;
            bottom: 0;
            font-size: $font-size-medium-x;
            line-height: 18px;
            font-weight: bold;
            letter-spacing: 1px;
          }
          .play-count {
            text-align: center;
            position: absolute;
            bottom: -20px;
            font-size: $font-size-small;
            line-height: 16px;
            .iconfont {
              font-size: inherit;
            }
          }
        }
      }
      .song-list-wrapper {
        padding: 41px 0 20px;
        border-radius: 10px;
        position: relative;
        top: -20px;
        background: $color-background;
        .sequence-play {
          position: absolute;
          top: 0;
          display: flex;
          align-items: center;
          width: 100%;
          height: 40px;
          padding-left: 16px;
          border-bottom: 1px solid rgb(228, 228, 228);
          .iconfont {
            font-size: 26px;
            color: $color-text;
            padding-right: 14px;
          }
          .text {
            font-size: $font-size-medium-x;
          }
          .count {
            font-size: $font-size-medium;
            color: $color-text-g;
          }
        }
      }
    }
  }
}
</style>
