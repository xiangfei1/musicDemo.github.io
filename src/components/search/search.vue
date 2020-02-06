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
        <SearchBox @query="onQueryChange" ref="searchBox"></SearchBox>
      </div>
      <!-- 热门搜索 -->
      <Scroll
        class="search-scroll-wrapper"
        :pullup="pullup"
        ref="scroll"
        @scrollToEnd="searchMore"
      >
        <div ref="search">
          <!-- 热门搜索 -->
          <div class="search-hots" v-show="!query">
            <p class="title">热门搜索</p>
            <span
              class="search-hots-item"
              v-for="(item, index) in hot"
              :key="index"
              @click="addQuery(item.first)"
              >{{ item.first }}</span
            >
          </div>
          <div class="shortcut-wrapper" v-show="!query">
            <!-- 显示搜索历史 -->
            <div class="search-history" v-show="searchHistory.length">
              <h1 class="title">
                <span class="text">搜索历史</span>
                <span class="clear" @click="showConfirm">
                  <i class="iconfont icon-his-del"></i>
                </span>
              </h1>
              <SearchList @select="addQuery" @delete="deleteOneHistory" :history="searchHistory"></SearchList>
            </div>
          </div>
          <!-- 显示搜索结果 -->
          <div class="search-result">
            <SearchResult
              @select="saveSearch"
              :query="query"
              ref="searchResult"
            ></SearchResult>
          </div>
        </div>
      </Scroll>
      <!-- 是否清除历史记录 -->
      <Confirm ref="confirm"></Confirm>
      <!-- 子组件显示 -->
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'subcomponents/search-box/search-box'
import Scroll from 'subcomponents/scroll/scroll'
import SearchResult from 'subcomponents/search-result/search-result'
import SearchList from 'subcomponents/search-list/search-list'
import Confirm from 'subcomponents/confirm/confirm'
import { getSearchHot } from 'api/search'
import { ERR_OK } from 'common/js/config'
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      hot: [], //热门搜索的内容
      pullup: true,
      query: '' //搜索框中的值
    }
  },
  created() {
    this._getSearchHot()
  },
  methods: {
    back() {
      this.$router.back()
      this.$refs.searchBox.clear()
    },
    // 判断输入框中值的变化
    onQueryChange(query) {
      this.query = query
    },
    // 获取热门搜索数据
    _getSearchHot() {
      getSearchHot().then(res => {
        if (res.status === 200) {
          this.hot = res.data.result.hots
          // console.log(this.hot)
        }
      })
    },
    // 热门搜索点击事件
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    // 获取更多歌曲信息
    searchMore() {
      this.$refs.searchResult.searchMore()
    },
    // 保存搜索历史
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    // 确认是否删除所有搜索记录
    showConfirm() {
      this.$refs.confirm.show()
    },
    // 删除指定搜索记录
    deleteOneHistory(item) {
      this.deleteSearchHistory(item)
    },
    // 刷新
    refresh() {
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 20)
    },
    ...mapActions(['saveSearchHistory','deleteSearchHistory'])
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  components: {
    SearchBox,
    Scroll,
    SearchResult,
    SearchList,
    Confirm
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
  .search-scroll-wrapper {
    height: 100%;
    overflow: hidden;
    .search-hots {
      margin: 0 20px;
      .title {
        padding: 15px 15px 0 5px;
        height: 30px;
        line-height: 30px;
        font-size: $font-size-small-x;
        color: $color-text-g;
      }
      .search-hots-item {
        display: inline-block;
        padding: 3px 5px;
        margin: 4px 4px;
        border: 0.8px solid $color-text-ggg;
        border-radius: 5px;
        line-height: 20px;
        color: $color-text;
        font-size: $font-size-medium;
      }
    }
    .shortcut-wrapper {
      position: relative;
      margin: 0 auto;
      .search-history {
        position: relative;
        margin: 10px 25px;
        .title {
          display: flex;
          align-items: center;
          height: 30px;
          font-size: 12px;
          color: $color-text-g;
          .text {
            flex: 1;
          }
          .clear {
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
    }
    .search-result {
      position: relative;
      width: 100%;
      top: 10px;
      bottom: 0;
    }
  }
}
</style>
