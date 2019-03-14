//推荐
import jsonp from '@assets/js/jsonp'
import { commonParams, options } from './config'
export function getRecommend() {
  const url =
    'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1,
  })
  return jsonp(url, data, options)
}
export function getDiscList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  let d = new Date()
  let date = d.getFullYear() + '_' + (d.getMonth() + 1)
  const data = Object.assign({}, commonParams, {
    tpl: 3,
    page: 'detail',
    date,
    topid: 26,
    type: 'top',
    song_begin: 0,
    song_num: 300,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
  })
  return jsonp(url, data, options)
}
