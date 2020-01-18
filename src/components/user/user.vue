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
        <Switches @switch='switchItem' :switches='switches' :currentIndex='currentIndex'></Switches>
      </div>
      <!-- 播放栏 -->
      <!-- 收藏列表、播放列表 -->
      <!-- 为空结果 -->
    </div>
  </transition>
</template>

<script>
import Switches from 'subcomponents/switches/switches'
export default {
  data() {
    return {
      currentIndex: 0,  // user页面导航栏，收藏播放列表切换判断
      switches: [{ name: '我的收藏' }, { name: '最近播放' }]  //user页面导航栏
    }
  },
  methods: {
    //返回上页
    back(){
      this.$router.back()
    },
    //改变判断条件
    switchItem(index){
      this.currentIndex = index
    }
  },
  components: {
    Switches
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
    transform: translate3d(-50%,0,0);
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
}
</style>
