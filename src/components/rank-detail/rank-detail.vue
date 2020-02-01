<template>
  <transition name="slide" mode="out-in">
    <div class="music-list">
      <!-- 标题 -->
      <div class="header" ref="header">
        <div class="back" @click="back">
          <i class="iconfont icon-back"></i>
        </div>
        <div class="text">
          <h1 class="title">{{ headerTitle }}</h1>
        </div>
      </div>
      <!-- 歌单列表 -->
      <Scroll
        class="list"
        @scroll="scroll"
        :listenScroll="listenScroll"
        :probeType="probeType"
      >
        <div class="music-list-wrapper">
          <!-- 背景图片 -->
          <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="text">
              <h2 class="list-title">
                {{ headerTitleTouchDown }}
              </h2>
              <div class="update">{{ updateTime }}</div>
            </div>
          </div>
          <!-- 歌单 -->
          <div class="song-list-wrapper">
            <!-- 播放按钮 -->
            <div class="sequence-play" @click="sequence">
              <i class="iconfont icon-play"></i>
              <span class="text">播放全部</span>
              <span class="count">(共{{ listDetail.length }}首)</span>
            </div>
            <!-- 歌单列表 -->
            <SongList @select="selectItem" :songs="listDetail"></SongList>
          </div>
        </div>
      </Scroll>
    </div>
  </transition>
</template>

<script>
import Scroll from 'subcomponents/scroll/scroll'
import { mapGetters, mapActions } from 'vuex' 
import SongList from 'subcomponents/song-list/song-list'
import { createSong } from 'common/js/song'
export default {
  data() {
    return {
      headerTitle: '歌单',
      listDetail: [], //歌曲数组
      scrollY: 0
    }
  },
  created() {
    if (!this.topList.id) {
      this.$router.push('/rank')
    }
    this._normalizeSongs(this.topList.tracks)
    this.listenScroll = true
    this.probeType = 3
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
  },
  computed: {
    //   背景
    bgStyle() {
      return `background-image: url(${this.topList.coverImgUrl})`
    },
    // 歌单名
    headerTitleTouchDown() {
      return this.topList.name
    },
    // 更新时间
    updateTime() {
      let time = new Date(this.topList.updateTime)
      let month = time.getMonth() + 1
      let day = time.getDate()
      return `最近更新:${month}月${day}日`
    },
    ...mapGetters(['topList'])
  },
  methods: {
    back() {
      this.$router.back()
    },
    //将数据保存到listDetail中
    _normalizeSongs(list) {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      let ret = []
      list.forEach(item => {
        ret.push(createSong(item))
      })
      this.listDetail = ret
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    // 歌曲点击事件
    selectItem(item,index) {
      this.selectPlay({
        list: this.listDetail,
        index: index
      })
    },
    // 播放全部歌曲
    sequence() {
      this.sequencePlay(this.listDetail)
    },
    ...mapActions([
      'selectPlay',
      'sequencePlay',
    ])
  },
  watch: {
    scrollY(newY) {
      let percent = Math.abs(newY / this.imageHeight)
      if(newY < -170) {
        this.headerTitle = this.topList.name
      } else {
        this.headerTitle = '歌单'
      }
      if(newY < 0) {
        this.$refs.header.style.background = `rgba(212, 68, 57, ${percent})`
      } else {
        this.$refs.header.style.background = 'rgba(212, 68, 57, 0)'
      }
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
  transform: translate3d(30%, 0, 0);
  opacity: 0;
}
.music-list {
  position: fixed;
  z-index: 100;
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
      top: 5px;
      left: 0;
      .iconfont {
        padding: 5px 5px;
        font-size: 30px;
      }
    }
    .text {
      position: absolute;
      left: 38px;
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
          width: 80%;
          height: 40px;
          bottom: 50px;
          left: 20px;
          color: #fff;
          .list-title {
            position: absolute;
            bottom: 0;
            font-style: italic;
            font-size: $font-size-large;
            line-height: 18px;
            font-weight: bold;
            letter-spacing: 1px;
          }
          .update {
            position: absolute;
            top: 45px;
            left: 7px;
            line-height: 14px;
            font-size: $font-size-small;
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
