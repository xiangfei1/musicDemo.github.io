<template>
  <div class="header">
    <h1 class="text">我是头部</h1>
    <router-link to="/user" class="mine" tag="div">
      <i class="iconfont icon-list"></i>
    </router-link>
    <router-link to="/search" class="search" tag="div">
      <i class="iconfont icon-search"></i>
    </router-link>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
.header {
  position: relative;
  background: $color-theme;
  width: 100%;
  height: 44px;
  text-align: center;
  .iconfont {
      display: block;
      padding: 11px;
      font-size: 22px;
      color: $color-theme-l;
    }
  .text {
    line-height: 44px;
    font-weight: bold;
    color: $color-text-l;
    letter-spacing: 3px;
  }
  .mine {
    position: absolute;
    left: 0;
    top: -1.5px;
  }
  .search {
    position: absolute;
    top: 0;
    right: 2px;
  }
}
</style>
