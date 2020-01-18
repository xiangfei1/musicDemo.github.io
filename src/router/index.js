import Vue from 'vue'
import Router from 'vue-router'
import User from 'cpnts/user/user'
import Search from 'cpnts/search/search'
import Recommend from 'cpnts/recommend/recommend'
import Singer from 'cpnts/singer/singer'
import Rank from 'cpnts/rank/rank'
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
      component: Search
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer
    }
  ]
})
