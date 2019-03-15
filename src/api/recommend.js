//推荐
import jsonp from '@assets/js/jsonp'
import { commonParams, options } from './config'
// import axios from 'axios'
export function getRecommend() {
  const url =
    'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}
// export function getDiscList() {
//   return axios.get('./discList.json', res => {
//     console.log('DiscList.json:', res)
//     return Promise.resolve(res)
//   })
// }
// img地址
// https://y.gtimg.cn/music/photo_new/T002R300x300M0000
