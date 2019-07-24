import { playMode } from '@assets/js/config.js'

const state = {
  singer: {}, // 歌手信息
  playing: false, // 播放状态
  fullScreen: false, //  全屏
  playList: [], //  播放列表 不同顺序播放列表
  sequenceList: [], // 播放列表
  mode: playMode.sequence, //   播放模式
  currentIndex: -1, // 当前播放项
  disc: '', // 推荐的数据
}

export default state
