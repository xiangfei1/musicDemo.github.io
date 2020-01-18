<template>
  <div id="app">
    <!-- 头部 -->
    <Header></Header>
    <!-- 导航栏 -->
    <Tab></Tab>
    <!-- 推荐 -->
    <keep-alive>
      <router-view />
    </keep-alive>
    <!-- 播放栏 -->
    <Player></Player>
  </div>
</template>

<script>
import Header from 'cpnts/header/header'
import Tab from 'cpnts/tab/tab'
import Player from 'cpnts/player/player'
export default {
  components: {
    Header,
    Tab,
    Player
  }
}
</script>

<style lang="scss">
@import 'common/scss/index.scss';
#app {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
