import Vue from 'vue'
import Router from 'vue-router'
import User from 'cpnts/user/user'
import Search from 'cpnts/search/search'
import Recommend from 'cpnts/recommend/recommend'
import Singer from 'cpnts/singer/singer'
import Rank from 'cpnts/rank/rank'
import MusicList from 'cpnts/music-list/music-list'
import RankDetail from 'cpnts/rank-detail/rank-detail'
import SingerDetail from 'cpnts/singer-detail/singer-detail'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/user',
      name: 'User',
      component: User
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      children: [
        {
        path: 'singer/:id',
        component: SingerDetail
      }  
      ]
    },
    {
      path: '/recommend',
      component: Recommend,
      name: 'Recommend',
      children: [
        {
          path: ':id',
          component: MusicList
        }
      ]
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: RankDetail
        }
      ]
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    }
  ]
})
