import types from './mutation-types'
import { playMode } from '@assets/js/config.js'
import { shuffle } from '@assets/js/util.js' // 播放模式
function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}
// 设置当前播放项
export function selectPlay({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
}

export function randomPlay({ commit }, { list }) {
  // 随机播放
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
}
