<template>
  <div class="singer" ref="singer">
    <!-- 歌曲列表 -->
    <listView :data="singers"></listView>
  </div>
</template>

<script>
import listView from 'subcomponents/listview/listview'
import { getSingers } from 'api/singer'
import Singer from 'common/js/singer'
const pinyin = require('pinyin')
const HOT_NAME = '热门'
const HOT_SINGERS = 10
export default {
  data() {
    return {
      singers: [] //歌手信息
    }
  },
  created() {
    this._getSingers()
  },
  methods: {
    _getSingers() {
      getSingers().then(res => {
        let list = res.data.artists
        // 进行排序操作
        list.map(item => {
          let py = pinyin(item.name[0], {
            //返回二维数组，一维代表歌手名的首字母，二维代表
            style: pinyin.STYLE_FIRST_LETTER //获取歌手名的首字母
          })
          item.initial = py[0][0].toUpperCase() //间隔各歌手首字母大写
        })
        this.singers = this._normalizeSinger(list)
      })
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME, //热门题目
          items: [] // 前十名热门歌手数据
        }
      }
      list.forEach((item, index) => {
        //    添加前十热门歌手
        if (index < HOT_SINGERS) {
          map.hot.items.push(
            new Singer({
              id: item.id,
              name: item.name,
              avatar: item.img1v1Url,
              aliaName: item.alias[0]
            })
          )
        }
        // 保存后续热门歌手，根据首字母排序
        // 判断map中是否存在以歌手首字母为属性的值
        const key = item.initial
        if(!map[key]) {
            map[key] = {
                title: key,
                items: []
            }
        }
        // 向map[key]中添加歌手数据
        map[key].items.push(new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            aliasName: item.alias[0]
        }))
      })
      let hot = []  //热门歌手数组
      let ret = []  //其他歌手数组
    //   通过不同数组保存数据，并对其他歌手进行排序
      for(let key in map) {
          let val = map[key]
          //判断是否是其他歌手，根据title的值
          if(val.title.match(/[A-Z]/)) {
              ret.push(val)
          } else if(val.title === HOT_NAME) {   //判断是否为热门歌手
              hot.push(val)
          }
      }
      //排序
      ret.sort((a,b)=>{
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      //连接两个数组
      return hot.concat(ret)
    }
  },
  components: {
    listView
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
