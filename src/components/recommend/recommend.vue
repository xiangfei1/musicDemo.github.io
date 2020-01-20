<template>
  <div class="recommend" ref="recommend">
    <!-- 滚动 -->
    <Scroll class="recommend-content" ref="scroll" :data="playlist">
      <div>
        <!-- 轮播图背景 -->
        <div class="decorate" v-show="banner.length" v-if="banner.length"></div>
        <!-- 轮播图 -->
        <div class="slide-wrapper" v-if="banner.length">
          <Slider>
            <div v-for="item in banner" :key="item.id" @click.stop="selectBanner(item)">
              <img :src="item.imageUrl" />
            </div>
          </Slider>
        </div>
        <!-- 推荐歌单 -->
        <div class="recommend-list" ref="recommendList">
          <h1 class="title">推荐歌单</h1>
          <ul>
            <li class="item" v-for="item in playlist" :key="item.id">
              <!-- 图片加阴影 -->
              <div class="icon">
                <!-- 图片上部阴影效果 -->
                <div class="gradients"></div>
                <!-- 图片 -->
                <img v-lazy="item.picUrl" />
              </div>
              <!-- 播放量 -->
              <p class="play-count">
                <i class="iconfont icon-listen"></i>
                {{ Math.floor(item.playCount / 10000) }}万
              </p>
              <!-- 文字描述 -->
              <div class="text">
                <p class="name">
                  {{ item.name }}
                </p>
              </div>
            </li>
          </ul>
        </div>
        <!-- 推荐歌曲 -->
        <div class="recommend-song">
          <h1 class="title">推荐歌曲</h1>
          <ul>
            <li class="item" v-for="item in recommendMusic" :key="item.id">
              <div class="icon">
                <img v-lazy="item.image"/>
              </div>
              <!-- 歌曲名称、及歌手名字 -->
              <p class="text">{{ item.name }}</p>
              <p class="singer">{{ item.singer }}</p>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script>
import Scroll from 'subcomponents/scroll/scroll'
import Slider from 'subcomponents/slider/slider'
import { getBanner, getRecommendList, getRecommendMusic } from 'api/recommend'
import { ERR_OK } from 'common/js/config'
import {createRecommendSong} from 'common/js/song.js'
import {getSongDetail} from 'api/search'
export default {
  data() {
    return {
      playlist: [], //推荐歌单
      banner: [], //轮播图
      recommendMusic: [] //推荐歌曲
    }
  },
  created() {
    this._getBanner()
    this._getRecommendList()
    this._getRecommendMusic()
  },
  methods: {
    // 获取轮播图图片
    _getBanner() {
      getBanner().then(res => {
        if (res.status == ERR_OK) {
          let list = res.data.banners
          this.banner = list.splice(4)
        }
      })
    },
    // 获取推荐歌单
    _getRecommendList() {
      getRecommendList().then((res) => {
        if (res.status === ERR_OK) {
          this.playlist = res.data.result
        }
      })
    },
    // 获取推荐歌曲
    _getRecommendMusic() {
      getRecommendMusic().then((res)=>{
        if(res.status === ERR_OK) {
          let list = res.data.result.map((item)=>{
            return createRecommendSong(item)
          })
          list.splice(9)
          this.recommendMusic = list
        }
      })
    },
    // 轮播图点击事件
    selectBanner(item) {
      console.log(item)
      let regHttp = /^http/
      let regSong = /\/song\?id/
      if(regHttp.test(item.url)) {
        window.open(item.url)
      }
      if(regSong.test(item.url)) {
        getSongDetail(item.targetId).then((res)=>{
          let m = res.data.songs[0]
          let song = {
            id: m.id,
            singer: m.ar[0].name,
            name: m.name,
            image: m.al.picUrl,
            album: m.al.name
          }
          this.inertSong(song)
          this.setFullScreen(true)
        })
      }
    }
  },
  components: {
    Scroll,
    Slider
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  z-index: 100;
  .recommend-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .decorate {
      position: absolute;
      width: 100%;
      height: 50vh;
      top: -31vh;
      z-index: -10;
      background: $color-theme;
      vertical-align: inherit;
    }
    .slide-wrapper {
      width: 96%;
      margin: 0 auto;
      border-radius: 5px;
      overflow: hidden;
    }
    .recommend-list {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      .title {
        height: 65px;
        line-height: 65px;
        padding-left: 1.5%;
        text-align: left;
        font-size: $font-size-medium;
        font-weight: bold;
        color: $color-text;
      }
      .item {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        width: 32%;
        padding: 0 1%;
        .icon {
          position: relative;
          display: inline-block;
          width: 100%;
          margin-bottom: 5px;
          .gradients {
            position: absolute;
            top: 0;
            width: 100%;
            height: 35px;
            border-radius: 3px;
            background: linear-gradient(
              rgba(109, 109, 109, 0.4),
              rgba(255, 255, 255, 0)
            );
          }
          img {
            width: 100%;
            height: 100%;
            border-radius: 3px;
          }
        }
        .play-count {
          position: absolute;
          top: 5px;
          right: 8px;
          font-size: $font-size-small-s;
          color: $color-text-l;
        }
        .text {
          float: left;
          line-height: 16px;
          text-align: left;
          height: 40px;
          overflow: hidden;
          margin-bottom: 10px;
          font-size: $font-size-small;
        }
      }
    }
    .recommend-song {
      margin-top: 20px;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      .title {
        height: 65px;
        line-height: 65px;
        padding-left: 1.5%;
        text-align: left;
        font-size: $font-size-medium;
        color: $color-text;
        font-weight: bold;
      }
      .item {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        width: 32%;
        padding: 0 1%;
        .icon {
          position: relative;
          display: inline-block;
          width: 100%;
          margin-bottom: 5px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 3px;
          }
        }
        .text {
          line-height: 16px;
          text-align: left;
          height: 16px;
          @include no-wrap();
          font-size: $font-size-small;
        }
        .singer {
          line-height: 16px;
          margin-bottom: 10px;
          text-align: left;
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-g;
        }
      }
    }
  }
}
</style>
