<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <!-- 进度条+滚动小圆点 -->
    <div class="bar-inner">
      <!-- 播放进度条 -->
      <div class="progress" ref="progress"></div>
      <!-- 小圆点容器 -->
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd"
      >
        <!-- 小圆点 -->
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from 'common/js/dom'
const progressBtnWidth = 16 //小球的宽度
const transform = prefixStyle('transform')
export default {
  data() {
    return {
      newPercent: 0
    }
  },
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    progressClick(e) {
      //得到进度条与浏览器窗口的位置
      const rect = this.$refs.progressBar.getBoundingClientRect()
      // 点击改变的宽度
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChangeEnd', percent)
    },
    // 设置进度条的宽度，小圆点的位置
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`
    },
    // 设置触摸开始事件
    progressTouchStart(e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth //  进度条的宽度
    },
    // 触摸移动事件
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      this._triggerPersent()
      const deltaX = e.touches[0].pageX - this.touch.startX //触摸移动的距离
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - progressBtnWidth,
        Math.max(0, this.touch.left + deltaX)
      )
      this._offset(offsetWidth)
    },
    // 触摸结束事件
    progressTouchEnd(e) {
      this.touch.initiated = false
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChangeEnd', percent)
    },
    // 开始百分比
    _triggerPersent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = barWidth * newPercent
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 5px solid $color-theme-l;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
