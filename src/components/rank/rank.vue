<template>
  <div class="rank" ref="rank">
    <!-- 滚动子组件 -->
    <Scroll class="toplist">
      <ul>
        <li class="item" v-for="item in yunTopList" :key="item.id" @click="selectItem(item)">
          <div class="icon">
            <img v-lazy="item.coverImgUrl" />
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.top" :key="index">
              <span>{{ index + 1 }}</span>
              <span>{{ song.name }} - {{ song.ar[0].name }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </Scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from 'subcomponents/scroll/scroll'
import { getTop } from 'api/rank'
import { ERR_OK } from 'common/js/config'
import { mapMutations } from 'vuex'
const YUNMUSIC_TOP = [1, 2, 5, 6, 11, 22, 31]
export default {
  data() {
    return {
      yunTopList: [] //排行榜
    }
  },
  created() {
    this._getTopList()
  },
  methods: {
    // 获取排行
    _getTopList() {
      for (let i = 0; i < YUNMUSIC_TOP.length; i++) {
        getTop(YUNMUSIC_TOP[i]).then(res => {
          if (res.status === ERR_OK) {
            let list = res.data.playlist
            list.top = res.data.playlist.tracks.splice(0, 3)
            this.yunTopList.push(list)
          }
        })
      }
    },
    // 点击事件
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      // console.log(item)
      this.setTopList(item)
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  components: {
    Scroll
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .toplist {
    height: 100%;
    overflow: hidden;
    padding-top: 5px;
    .item {
      display: flex;
      margin: 0 10px;
      padding: 3px 0;
      height: 100px;
      border-bottom: 1px solid rgb(228, 228, 228);
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
        img {
          height: 100%;
          width: 100%;
          border-radius: 3px;
        }
      }
      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        color: $color-text;
        font-size: $font-size-small-x;
        .song {
          @include no-wrap();
          line-height: 30px;
        }
      }
    }
  }
}
</style>
