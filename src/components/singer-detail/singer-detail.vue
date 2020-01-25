<template>
  <transition name="slide">
    <div class="music-list">
      <!-- 头部 -->
      <div class="header">
        <div class="back" @click="back">
          <i class="iconfont icon-back"></i>
        </div>
        <div class="text">
          <h1 class="title">{{ headerTitle }}</h1>
        </div>
      </div>
      <!-- 歌手歌曲 -->
      <Scroll class="list">
        <div class="music-list-wrapper">
          <!-- 背景 -->
          <div class="bg-image" :style="bgStyle">
            <div class="text">
              <h2 class="list-title">{{ headerTitleTouchDown }}</h2>
            </div>
          </div>
          <!-- 歌曲 -->
          <div class="song-list-wrapper">
            <div class="sequence-play">
              <i class="iconfont icon-play"></i>
              <span class="text">播放全部</span>
              <span class="count">(共{{ listDetail.length }}首)</span>
            </div>
            <SongList :songs="listDetail"></SongList>
          </div>
        </div>
      </Scroll>
    </div>
  </transition>
</template>

<script>
import Scroll from 'subcomponents/scroll/scroll'
import SongList from 'subcomponents/song-list/song-list'
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'common/js/config'
import { createSong } from 'common/js/song'
export default {
  data() {
    return {
      headerTitle: '歌手',
      listDetail: [], //歌手歌曲
      node: null //中转变量
    }
  },
  created() {
    this._getSingerDetail()
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.singer.avatar})`
    },
    headerTitleTouchDown() {
      let name = ''
      if (this.singer.aliaName) {
        name = this.singer.name + `(${this.singer.aliaName})`
      } else {
        name = this.singer.name
      }
      return name
    },
    ...mapGetters(['singer'])
  },
  methods: {
    back() {
      this.$router.back()
    },
    // 得到歌手的信息
    _getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.status == ERR_OK) {
          this.node = res.data.hotSongs
        }
      })
    },
    // 得到歌手歌曲数据
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        ret.push(createSong(item))
      })
      return ret
    }
  },
  watch: {
    node(val) {
      this.listDetail = this._normalizeSongs(val)
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
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(30%, 0, 0);
  opacity: 0;
}
.music-list {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
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
      left: 4px;
      .iconfont {
        font-size: 30px;
        padding: 5px 5px;
      }
    }
    .text {
      position: absolute;
      left: 45px;
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
        background-position: 0 30%;
        background-size: cover;
        .text {
          position: absolute;
          width: 80%;
          height: 40px;
          bottom: 40px;
          left: 20px;
          color: #fff;
          .list-title {
            position: absolute;
            bottom: 0;
            font-size: 17px;
            line-height: 18px;
            font-weight: bold;
            letter-spacing: 1px;
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
            font-size: 18px;
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
