<template>
  <div class="player">
    <!-- 正常播放 -->
    <transition name="normal">
      <div class="normal-player">
        <!-- 背景 -->
        <div class="background"></div>
        <!-- 头部 -->
        <div class="top"></div>
        <!-- 中间 -->
        <div class="middle"></div>
        <!-- 底部 -->
        <div class="bottom"></div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
  .player {
    display: none;
  }
</style>
