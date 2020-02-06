<template>
  <div class="result" v-show="query && !searchShow">
    <!-- 匹配的歌单或歌手 -->
    <div class="search-result">
      <p class="title">最佳匹配</p>
      <!-- 显示匹配到的歌手信息 -->
      <div
        class="search-result-item"
        v-if="result.artists && showSinger"
        @click="selectItem(result.artists[0])"
      >
        <!-- 歌手图片 -->
        <img :src="result.artists[0].img1v1Url" width="50" height="50" />
        <!-- 歌手名字 -->
        <span>歌手：{{ result.artists[0].name }}</span>
      </div>
      <!-- 显示匹配到的歌单信息 -->
      <!-- <div class="search-result-item">
            </div> -->
    </div>
    <!-- 匹配的歌曲列表 -->
    <ul class="result-list">
      <li
        class="result-item"
        v-for="(item, index) in songs"
        :key="index"
        @click="selectSong(item)"
      >
        <div class="icon">
          <i class="iconfont icon-no-result"></i>
        </div>
        <div class="name">
          <p class="song">{{ item.name }}</p>
          <p class="singer">{{ item.singer }}</p>
        </div>
      </li>
      <Loading v-show="haveMore && query"></Loading>
    </ul>
  </div>
</template>

<script>
import { getSearchSongs, getSearchSuggest,getSongDetail } from 'api/search'
import { createSearchSong } from 'common/js/song'
import Loading from 'subcomponents/loading/loading'
import Singer from 'common/js/singer'
import { mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      page: 0, //页码
      result: {}, //歌单、歌手搜索结果
      songs: [], //歌曲搜索结果
      searchShow: true, //是否进行搜索
      haveMore: true //懒加载图片
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    //   根据query、page获取搜索的信息
    search() {
      this.searchShow = false
      this.haveMore = true
      getSearchSongs(this.query, this.page).then(res => {
        if (!res.data.result) {
          this.haveMore = false
          return
        }
        let temp = res.data.result.songs
        let ret = []
        temp.forEach(item => {
          ret.push(createSearchSong(item))
        })
        this.$emit('refresh')
        this.songs = ret
      })
      this.page += 30
      getSearchSuggest(this.query).then(res => {
        this.result = res.data.result
      })
    },
    // 获取更多搜索结果
    searchMore() {
      if (!this.haveMore) {
        return
      }
      if (!this.songs.length) {
        return
      }
      getSearchSongs(this.query, this.page).then(res => {
        if (!res.data.result.songs) {
          return
        }
        let list = res.data.result.songs
        let ret = []
        list.forEach(item => {
          ret.push(createSearchSong(item))
        })
        this.songs = this.songs.concat(ret)
        this.$emit('refresh')
        this.page += 30
      })
    },
    // 歌手、歌单点击事件
    selectItem(item) {
      // console.log(item)
      let singer = new Singer({
        id: item.id,
        name: item.name,
        avatar: item.img1v1Url
      })
      this.$router.push({
        path: `/search/singer/${singer.id}`
      })
      this.setSinger(singer)
      this.$emit('select')
    },
    // 歌曲点击事件
    selectSong(item) {
      getSongDetail(item.id).then(res=>{
        item.image = res.data.songs[0].al.picUrl
        this.insertSong(item)
      })
      this.$emit('select')
    },
    ...mapActions(['insertSong']),
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  watch: {
    query(val) {
      // 搜索框中值为0
      if (val === '') {
        this.result = {}
        this.songs = []
        this.haveMore = false
        return
      }
      this.result = {}
      this.songs = []
      this.page = 0
      this.haveMore = true
      this.searchShow = true
      this.search()
    }
  },
  components: {
    Loading
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
.result {
  height: 100%;
  overflow: hidden;
  .search-result {
    .title {
      padding-left: 20px;
      padding-bottom: 10px;
      color: $color-theme;
      font-size: 11px;
    }
    .search-result-item {
      display: flex;
      align-items: center;
      padding: 8px 20px;
      border-bottom: 1px solid rgb(228, 228, 228);
      font-size: $font-size-medium;
      img {
        flex: 0 0 50px;
        padding-right: 15px;
      }
    }
  }
  .result-list {
    padding-bottom: 30px;
    .result-item {
      position: relative;
      display: flex;
      padding: 3px 20px;
      height: 50px;
      align-items: center;
      border-bottom: 1px solid rgb(228, 228, 228);
      p {
        padding: 3px 0;
      }
      .icon {
        position: absolute;
        left: 10px;
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text;
        overflow: hidden;
        position: absolute;
        left: 30px;
        .song {
          font-size: $font-size-medium-x;
          color: $color-text;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .singer {
          font-size: 12px;
          color: $color-text-g;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
