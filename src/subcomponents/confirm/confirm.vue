<template>
  <transition name="confirm">
    <div class="confirm" v-show="flag" @click.stop="hide">
        <div class="confirm-wrapper">
            <div class="confirm-content">
                <p class="text">是否清除记录？</p>
                <div class="operate">
                    <div class="operate-btn left">取消</div>
                    <div class="operate-btn" @click="clearAllHistory">清空</div>
                </div>
            </div>
        </div>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      flag: false
    }
  },
  methods: {
    // 显示确认页面
    show() {
      this.flag = true
    },
    //隐藏确认页面
    hide() {
      this.flag = false
    },
    clearAllHistory() {
        this.deleteHistory()
    },
    ...mapActions([
        'deleteHistory'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
.confirm-enter-active,.confirm-leave-active {
    transition: all .3s;
}
.confirm-enter,.confirm-leave-to {
    transform: scale(0.9);
}
.confirm {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .confirm-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      z-index: 999;
      border: 1px solid $color-theme;
      box-shadow: 5px 5px 5px #ccc;
      .confirm-content {
          width: 270px;
          border-radius: 5px;
          background: $color-background;
          .text {
              padding: 12px 15px;
              line-height: 22px;
              text-align: center;
              font-size: $font-size-medium-x;
              color: $color-text;
          }
          .operate {
              display: flex;
              align-items: center;
              text-align: center;
              font-size: $font-size-medium-x;
              .operate-btn {
                  flex: 1;
                  line-height: 22px;
                  padding: 12px 0;
                  border-top: 1px solid #ccc;
                  color: $color-theme;
                  &.left {
                      border-right: 1px solid #ccc;
                  }
              }
          }
      }
  }
}
</style>
