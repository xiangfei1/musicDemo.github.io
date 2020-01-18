<template>
  <!-- 过渡 -->
  <transition name="search">
    <!-- 内容 -->
    <div class="search">
      <!-- 搜索框 -->
      <div class="search-box-wrapper">
        <!-- 返回按钮 -->
        <i class="iconfont icon-back" @click="back"></i>
        <!-- 搜索框子组件 -->
        <SearchBox @query="onQueryChange"></SearchBox>
      </div>
      <!-- 热门搜索 -->
      <!-- 是否清除历史记录 -->
    </div>
  </transition>
</template>

<script>
import SearchBox from 'subcomponents/search-box/search-box'
export default {
  methods: {
    back() {
      this.$router.back()
    },
    onQueryChange(query){
      this.query = query
    }
  },
  components: {
    SearchBox
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
.search-enter-active,
.search-leave-active {
  transition: all 0.3s;
}
.search-enter,
.search-leave-to {
  transform: translate3d(50%, 0, 0);
  opacity: 0;
}
.search {
  position: fixed;
  z-index: 100;
  width: 100%;
  top: 0;
  bottom: 0;
  background: $color-background;
  .search-box-wrapper {
    padding: 10px 40px 10px 43px;
    background: $color-theme;
    .iconfont {
      position: absolute;
      left: 5px;
      top: 3px;
      padding: 3px 2px;
      font-size: 30px;
      color: #fff;
    }
  }
}
</style>
