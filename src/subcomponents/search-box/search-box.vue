<template>
  <div class="search-box">
    <input type="text" :placeholder="placeholder" v-model="query" class="box" />
    <i v-show="query" class="iconfont icon-delete" @click="clear"></i>
  </div>
</template>

<script>
import {debounce} from 'common/js/utl.js'
export default {
  data() {
    return {
      query: '',
      placeholder: '搜索歌曲、歌手'
    }
  },
  created(){
      this.$watch('query',debounce((newQuery)=>{    //每个300毫秒向父组件传递query中的值
          this.$emit('query',newQuery)
      },300))
  },
  methods: {
      clear(){
          this.query = ''
      },
      setQuery(query) {
        this.query = query
      }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 25px;
  border-bottom: 1px solid rgb(235, 235, 235);
  .box {
    flex: 1;
    line-height: 25px;
    background: $color-theme-head;
    color: #fff;
    font-size: 14px;
    border: none;
    outline: medium;
    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
  }
  .icon-delete {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 24px;
      color: rgba(255, 255, 255, 0.8);
      border: none;
  }
}
</style>
