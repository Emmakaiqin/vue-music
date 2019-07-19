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
    this.text = '' //  歌曲数据
  }
}
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    album: musicData.albumname,
    name: musicData.songname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url: `http://111.202.98.146/amobile.music.tc.qq.com/${musicData.songmid}.m4a?fromtag=46`,
    url:
      'http://111.202.98.146/amobile.music.tc.qq.com/C400001Qu4I30eVFYb.m4a?guid=1972071100&vkey=6AE257D4770E091643D98DCB4430A54D5419433942C4B0F2636DDDE8E6E649E3BD5F41FD6ED7B060E462EA18CD97BB8D39BA5546B7146BF1&uin=0&fromtag=66',
    text: '',
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}
