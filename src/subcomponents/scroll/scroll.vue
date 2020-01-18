<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import Bscroll from 'better-scroll'
export default {
  props: {
    /**
     * 为 1 滚动的时候非实时派发scroll事件，会截流
     * 为 2 滚动的时候实时派发scroll事件，不会截流
     * 为 3 除了实时派发scroll事件，在momentum滚动动画运行中也会实时派发事件
     */
    probeType: {
      type: Number,
      default: 1
    },
    //BetterScroll默认组织浏览器原生click事件，设置为true时，BetterScroll会派发click事件
    click: {
      type: Boolean,
      default: true
    },
    //    列表数据
    data: {
      type: Array,
      default: null
    },
    //是否派发滚动事件
    listenScroll: {
      type: Boolean,
      default: false
    },
    /**
     * pullup 插件为 BetterScroll 提供了监测上拉动作的能力。
     * 当成功监测到一次上拉动作时，会触发 pullingUp 事件。
     */
    pullup: {
      type: Boolean,
      default: false
    },
    //    当数据更新后，刷新scroll的延迟
    refreshDelay: {
      type: Number,
      default: 20
    },
    beforeScroll: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    //   保证在DOM渲染完毕后初始化better-scroll
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) return
      // better-scroll的初始化
      this.scroll = new Bscroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      // 是否派发滚动事件
      if (this.listenScroll) {
        let that = this
        this.scroll.on('scroll', pos => {
          that.$emit('scroll', pos)
        })
      }
      // 是否派发底部上拉事件
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          //滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }
    },
    enable() {
      // 代理better-scroll的enable方法
      this.scroll && this.scroll.enable()
    },
    disable() {
      //代理better-scroll的disable方法
      this.scroll && this.scroll.disable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>

<style lang="scss" scoped></style>
