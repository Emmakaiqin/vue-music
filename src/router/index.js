import Vue from 'vue'
import Router from 'vue-router'
import Rank from '@components/rank/rank'
import Recommend from '@components/recommend/recommend'
import Singer from '@components/singer/singer'
import SingerDetail from '@components/singer-detail/singer-detail'
import Search from '@components/search/search'
import Disc from '@components/disc/disc'
import TopList from '@components/top-list/top-list'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend',
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc,
        },
      ],
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail,
        },
      ],
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList,
        },
      ],
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      children:[
        {
          path:':id',
          component: SingerDetail
        }
      ]
    },
  ],
})
