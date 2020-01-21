<template>
  <transition name="slide" mode="out-in">
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
      <Scroll ref="list" class="list">
        <div class="music-list-wrapper">
          <!-- 歌单背景 -->
          <div class="bg-image" :style="bgStyle" ref="bgImage"></div>
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
      headerTitle: '歌单'
    }
  },
  computed: {
    //  背景
    bgStyle() {
      return `background-image: url(${this.musicList.picUrl})`
    },
    // 状态管理Vuex
    ...mapGetters(['musicList'])
  },
  methods: {
    back() {
      this.$router.back()
    },

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
  transform: translate3d(33%, 0, 0);
  opacity: 0;
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
      left: 4px;
      .icon-back {
        padding: 5px 10px;
        font-size: 30px;
      }
    }
    .text {
      position: absolute;
      left: 50px;
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
          }
      }
  }
}
</style>
