<template>
  <Scroll
    class="listview"
    ref="listview"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll"
  >
    <!-- 歌曲列表 -->
    <ul>
      <li
        class="list-group"
        v-for="group in data"
        :key="group.id"
        ref="listgroup"
      >
        <!-- 分类标题/歌曲 -->
        <!-- 分类标题 -->
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li
            class="list-group-item"
            v-for="item in group.items"
            :key="item.id"
          >
            <!-- 歌手图片 -->
            <img v-lazy="item.avatar" class="avatar" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 字母列表 -->
    <div
      class="list-shortcut"
      @touchstart="onshortcutStart"
      @touchmove.stop.prevent="onShortcutMove"
    >
      <ul>
        <!-- 给每个字母添加data-index属性，以便后续绑定触发触摸事件 -->
        <li
          class="item"
          v-for="(item, index) in shortcutlist"
          :key="item.id"
          :data-index="index"
          :class="{ current: currentIndex == index }"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </Scroll>
</template>

<script>
import Scroll from 'subcomponents/scroll/scroll'
import { getData } from 'common/js/dom'
const ANCHOR_HEIGHT = 20    //每个小标题的高度
export default {
  props: {
    data: {
      type: Array
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0
    }
  },
  created() {
    this.listenScroll = true
    this.probeType = 3
    this.listHeight = []
    this.touch = {}
  },
  methods: {
    //   滚动改变y轴的位置
    scroll(pos) {
      this.scrollY = pos.y
    },
    //   刷新
    refresh() {
      this.$refs.listview.refresh()
    },
    // 计算每个组的高度,并获取每个小组y轴上的位置所在
    _calculateHeight() {
      let list = this.$refs.listgroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight
        this.listHeight.push(height)
      }
    },
    // 触摸事件
    onshortcutStart(e) {
      let Index = getData(e.target, 'index')    //得到右侧对应字母的index
      let firstTouch = e.touches[0] //当前屏幕上所有触发源的列表
      this.touch.y1 = firstTouch.pageY  //获取触摸目标在页面中Y坐标
      this.touch.Index = Index
      this._scrollTo(Index)
    },
    // 触摸移动事件
    onShortcutMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) /ANCHOR_HEIGHT | 0
        let Index = parseInt(this.touch.Index) + delta
        this._scrollTo(Index)
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 1) {
        index = this.listHeight.length - 1
      }
      //   console.log(index)
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)
    }
  },
  watch: {
    data() {
      let _this = this
      setTimeout(() => {
        _this._calculateHeight()
      }, 20)
    },
    // 根据scrollY的变化，改变右侧字母的颜色
    scrollY(newY) {
      let listHeight = this.listHeight
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          return
        }
      }
      this.currentIndex = listHeight.length - 2
    }
  },
  computed: {
    shortcutlist() {
      return this.data.map(item => {
        return item.title
      })
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  .list-group {
    .list-group-title {
      height: 20px;
      line-height: 20px;
      padding-left: 12px;
      margin-bottom: 10px;
      font-size: $font-size-small;
      color: #fff;
      background: rgba(0, 0, 0, 0.1);
    }
    .list-group-item {
      display: flex;
      align-items: center;
      padding: 4px;
      margin: 0 5px;
      border-bottom: 1px solid rgb(228, 228, 228);
      &:last-child {
        border: none;
        margin-bottom: 10px;
      }
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 3px;
      }
      .name {
        margin-left: 20px;
        color: $color-text;
        font-size: $font-size-medium;
      }
    }
  }
  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 3px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 200px 0;
    border-radius: 3px;
    text-align: center;
    font-family: Helvetica;
    .item {
      padding: 5px 5px;
      line-height: 1;
      color: $color-text-g;
      font-size: $font-size-small;
      font-weight: bold;
      &.current {
        color: $color-theme;
      }
    }
  }
}
</style>
