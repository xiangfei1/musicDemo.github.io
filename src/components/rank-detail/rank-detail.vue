<template>
  <transition name="slide" mode="out-in">
    <div class="music-list">
      <!-- 标题 -->
      <div class="header">
        <div class="back" @click="back">
          <i class="iconfont icon-back"></i>
        </div>
        <div class="text">
          <h1 class="title">{{ headerTitle }}</h1>
        </div>
      </div>
      <!-- 歌单列表 -->
      <Scroll class="list">
        <div class="music-list-wrapper">
          <!-- 背景图片 -->
          <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="text">
              <h2 class="list-title"></h2>
              <div class="update"></div>
            </div>
          </div>
          <!-- 歌单 -->
          <div class="song-list-wrapper"></div>
        </div>
      </Scroll>
    </div>
  </transition>
</template>

<script>
import Scroll from 'subcomponents/scroll/scroll'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      headerTitle: '歌手'
    }
  },
  computed: {
    //   背景
    bgStyle() {
      return `background-image: url(${this.toplist.coverImgUrl})`
    },
    ...mapGetters(['toplist'])
  },
  methods: {
    back() {
      this.$router.back()
    }
  },
  components: {
    Scroll
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
    }
  }
}
</style>
