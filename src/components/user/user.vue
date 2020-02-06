<template>
  <!-- 滑块动画 -->
  <transition name="slide">
    <!-- user内容 -->
    <div class="user">
      <!-- 返回标签 -->
      <div class="back" @click="back">
        <i class="iconfont icon-back"></i>
      </div>
      <!-- switches组件 -->
      <div class="switches-wrapper">
        <Switches
          @switch="switchItem"
          :switches="switches"
          :currentIndex="currentIndex"
        ></Switches>
      </div>
      <!-- 播放全部 -->
      <div class="sequence-play" @click="sequence">
        <i class="iconfont icon-play"></i>
        <span class="text">播放全部</span>
        <span class="count">(共{{ count }}首)</span>
      </div>
      <!-- 收藏列表、播放列表 -->
      <div class="list-wrapper">
        <!-- 收藏列表 -->
        <Scroll class="list-scroll" v-if="currentIndex === 0" :data="favoriteList">
          <div class="list-inner">
            <SongList  @select="selectSong" :songs="favoriteList"></SongList>
          </div>
        </Scroll>
        <!-- 播放记录列表 -->
        <Scroll
          v-if="currentIndex === 1"
          class="list-scroll"
          :data="playHistory"
        >
          <div class="list-inner">
            <SongList @select="selectSong" :songs="playHistory"></SongList>
          </div>
        </Scroll>
      </div>
      <!-- 为空结果 -->
      <div class="no-result-wrapper" v-show="noResult">
        <div class="no-result">
          <div class="no-result-icon">
            <i class="iconfont icon-no-result"></i>
          </div>
          <p class="no-result-text">{{ noResultText }}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from 'subcomponents/switches/switches'
import Scroll from 'subcomponents/scroll/scroll'
import SongList from 'subcomponents/song-list/song-list'
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      currentIndex: 0, // user页面导航栏，收藏播放列表切换判断
      switches: [{ name: '我的收藏' }, { name: '最近播放' }] //user页面导航栏
    }
  },
  // created() {
  //   this.listenScroll = true
  //   this.probeType = 3
  // },
  computed: {
    // 无结果，收藏列表、播放列表分别显示不同文字
    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length
      } else {
        return !this.playHistory.length
      }
    },
    noResultText() {
      if (this.currentIndex === 0) {
        return 'emmm，自己到底喜欢什么歌曲呢？'
      } else {
        return '暂时还没有听过歌曲哟！'
      }
    },
    count() {
      if (this.currentIndex === 0) {
        return this.favoriteList.length
      } else {
        return this.playHistory.length
      }
    },
    ...mapGetters(['favoriteList', 'playHistory'])
  },
  methods: {
    //返回上页
    back() {
      this.$router.back()
    },
    //改变判断条件
    switchItem(index) {
      this.currentIndex = index
    },
    // 点击歌曲播放
    selectSong(item) {
      this.insertSong(item)
    },
    // 播放全部
    sequence() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      if(list.length === 0) {
        return
      } else {
        this.sequencePlay(list)
      }

    },
    ...mapActions(['sequencePlay', 'selectPlay','insertSong'])
  },
  components: {
    Switches,
    Scroll,
    SongList
  }
}
</script>

<style lang="scss">
@import 'common/scss/variable.scss';
.user {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: $color-background;
  // & 为父类选择器，这里表示为.user
  &.slide-enter-active,
  &.slide-leave-active {
    transition: all 0.3s;
  }
  &.slide-enter,
  &.slide-leave-to {
    transform: translate3d(-50%, 0, 0);
    opacity: 0;
  }
  .back {
    position: absolute;
    top: 5px;
    left: 0;
    .iconfont {
      padding: 6px 10px;
      font-size: 30px;
      color: #fff;
    }
  }
  .switches-wrapper {
    height: 44px;
    display: flex;
    align-items: center;
    background: $color-theme;
  }
  .sequence-play {
    position: absolute;
    top: 44px;
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    padding-left: 16px;
    border-bottom: 1px solid rgb(228, 228, 228);
    .iconfont {
      font-size: 28px;
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
  .list-wrapper {
    position: absolute;
    top: 84px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      overflow: hidden;
      height: 100%;
    }
  }
  .no-result-wrapper {
    margin-top: 60%;
    .no-result {
      text-align: center;
      .no-result-icon {
        .iconfont {
          font-size: 50px;
        }
      }
      .no-result-text {
        margin-top: 30px;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
  }
}
</style>
