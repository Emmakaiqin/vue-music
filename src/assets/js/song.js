import { Base64 } from 'js-base64'
import songText from '@assets/json/songText.json'
export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url, text }) {
    this.id = id // 歌曲id
    this.mid = mid
    this.singer = singer //歌手
    this.name = name //歌曲名字
    this.album = album //专辑
    this.duration = duration //时长
    this.image = image //封面
    this.url = url //资源路径
    this.text = text //  歌曲数据
  }
}
export function createSong(musicData, index) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    album: musicData.albumname,
    name: musicData.songname,
    duration: makeDuration(index),
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: makeUrl(index),
    text: makeText(index),
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(s => {
    if (s.name) {
      ret.push(s.name)
    }
  })
  return ret.join('/')
}

function makeDuration(index) {
  let i = index % 6
  let times = [156, 269, 255, 239, 310, 263] // 6个音频对应时间
  return times[i]
}
function makeUrl(index) {
  // 随机下本地6个音频
  let i = index % 6
  let url = require(`@/assets/music/${i}.mp3`)
  return url
}
function makeText(index) {
  // 歌词
  let i = index % 6
  let text = ''
  if (i == 5) {
    text = Base64.decode(songText[0].lyric)
  } else {
    text = Base64.decode(songText[i].lyric)
  }
  return text
}
