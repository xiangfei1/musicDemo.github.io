<template>
  <div class="search-list" v-show="history.length">
    <transition-group name="search" tag="ul">
      <li
        class="search-item"
        v-for="item in history"
        :key="item"
        @click="selectItem(item)"
      >
        <span class="text">{{ item }}</span>
        <span class="icon" @click.stop="deleteItem(item)">
          <i class="iconfont icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    history: {
      type: Array
    }
  },
  methods: {
    //   历史记录点击事件
    selectItem(item) {
      this.$emit('select', item)
    },
    //   点击删除指定历史记录
    deleteItem(item) {
      this.$emit('delete', item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 35px;
    overflow: hidden;
    font-size: $font-size-medium;
    font-size: 14px;
    &.search-enter-active,
    &.search-leave-active {
      transition: all 0.1s;
    }
    &.search-enter,
    &.search-leave-to {
      height: 0;
    }
    .text {
      flex: 1;
      color: $color-text;
    }
    .icon {
      display: flex;
      width: 34px;
      height: 100%;
      align-items: center;
      justify-content: center;
      .iconfont {
        font-size: $font-size-large-x;
        align-items: center;
      }
    }
  }
}
</style>
