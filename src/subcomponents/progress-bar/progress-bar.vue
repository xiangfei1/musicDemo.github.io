<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
        <!-- 进度条+滚动小圆点 -->
        <div class="bar-inner">
            <!-- 播放进度条 -->
            <div class="progress" ref="progress"></div>
            <!-- 小圆点容器 -->
            <div class="progress-btn-wrapper" ref="progressBtn">
                <!-- 小圆点 -->
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
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
            console.log(offsetWidth)
        },
        _offset(offsetWidth){
            this.$refs.progress.style.width = `${offsetWidth}px`
            this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
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