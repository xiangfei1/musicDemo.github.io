<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        v-for="(item, index) in dots"
        :key="index"
        :class="{ active: currentPageIndex === index }"
      ></span>
    </div>
  </div>
</template>

<script>
import Bscroll from 'better-scroll'
import { addClass } from 'common/js/dom'
export default {
  data() {
    return {
      dots: [], //小圆点
      currentPageIndex: 0 //判断圆点与图片的同步
    }
  },
  props: {
    //循环播放
    loop: {
      type: Boolean,
      default: true
    },
    // 自动播放
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 间隔
    interval: {
      type: Number,
      default: 2000
    }
  },
  mounted() {
    this._setSliderWidth()
    setTimeout(() => {
      this._initDots()
      this._initSlider()
      if (this.autoPlay) {
        this._play()
      }
    }, 20)
    // 监听窗口大小改变时间
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    // 设置轮播图容器以及每个图片的宽度
    _setSliderWidth() {
      this.children = this.$refs.sliderGroup.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth // 可见宽度
      for (let i = 0; i < this.children.length; i++) {
        //获取每个子元素
        let child = this.children[i]
        // 设置每个子元素的类名、宽度
        addClass(child, 'slide-item')
        child.style.width = sliderWidth + 'px'
        //累加所有子元素的宽度，计算轮播图盒子的总宽度
        width += sliderWidth
      }
      //循环播放，则首尾各添加一个子元素的宽度，即增加的长度为2
      if (this.loop) {
        width += 2 * sliderWidth
      }
      //设置轮播图盒子的总宽度
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    // 初始化轮播图
    _initSlider() {
      this.slider = new Bscroll(this.$refs.slider, {
        scrollX: true, //设置轮播方向为横向
        momentum: false, //生成滚动动画，默认值为true，实现轮播图则设置为false
        snap: {
          loop: true,
          threshold: 100
        },
        bounce: false, //设置了 slide.loop 为 true 时，bounce 值需要设置为 false，否则会在循环衔接的时候出现闪烁。
        stopPropagation: true, //是否阻止事件冒泡。多用在嵌套 scroll 的场景。
        click: true
      })
      // 监听滚动结束时间获取pageX
      const _this = this
      _this.slider.on('scrollEnd', () => {
        let pageIndex = _this.slider.getCurrentPage().pageX
        this.currentPageIndex = pageIndex
        if (_this.autoPlay) {
          clearTimeout(_this.timer)
          _this._play()
        }
      })
      // 滚动开始前
      this.slider.on('beforeScrollStart', () => {
        clearTimeout(_this.timer)
      })
    },
    // 控制自动播放
    _play() {
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    // 生命周期destroyed销魂清除定时器，有利于内存释放
    destroyed() {
      clearTimeout(this.timer)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
.slider {
  min-height: 1px;
  position: relative;
  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap; //文本不换行
    .slide-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      img {
        width: 100%;
        display: block;
      }
    }
  }
  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;
      &.active {
        border-radius: 5px;
        background: $color-highlight-background;
      }
    }
  }
}
</style>
