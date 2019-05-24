export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id // 歌曲id
    this.mid = mid
    this.singer = singer //歌手
    this.name = name //歌曲名字
    this.album = album //专辑
    this.duration = duration //时长
    this.image = image //封面
    this.url = url //资源路径
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
    image: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${musicData.albumid}.jpg?max_age=2592000`,
    url: `https://tirdparty.gtimg.com/${musicData.songid}.m4a/fromtag=38`,
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
