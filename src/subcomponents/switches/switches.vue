<template>
  <ul class="switches">
    <li
      class="switch-item"
      v-for="(item, index) in switches"
      :key="index"
      @click="switchItem(index)"
      :class="{'active': currentIndex === index}"
    >
      <span>{{ item.name }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    switches: {
      type: Array
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchItem(index) {
      this.$emit('switch', index)
    }
  }
}
</script>

<style lang="scss">
@import 'common/scss/variable.scss';
.switches {
  display: flex;
  align-items: center;
  margin: 0 auto;
  width: 240px;
  .switch-item {
    flex: 1;
    margin: 0 20px;
    padding: 8px;
    font-size: 14px;
    color: $color-text-l;
    border-bottom: 2px solid $color-theme;
    &.active {
        border-bottom: 2px solid $color-text-l;
        color: #fff;
    }
  }
}
</style>
