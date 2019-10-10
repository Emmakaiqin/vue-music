import pinYin from 'js-pinyin'

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  let _arr = arr.slice() // 不改变原始数据 改变副本
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

pinYin.setOptions({ checkPolyphone: false, charCase: 0 })

export const Style = {
  CamelChars: 1,
  FullChars: 2,
}

export function firstLetter(text) {
  if (!text) {
    return ''
  }
  return pinYinify(text, Style.CamelChars)
}

// 带缓存性质的关键字拼音匹配
export function matchKeywords(text, keywords) {
  if (!text) {
    return false
  }
  if (text.indexOf(keywords) !== -1) {
    return true
  }

  if (matchKeywordsStyle(text, keywords, Style.FullChars)) {
    return true
  }
  if (matchKeywordsStyle(text, keywords, Style.CamelChars)) {
    return true
  }

  return false
}

function matchKeywordsStyle(text, keywords, style) {
  if (!text) {
    return false
  }
  if (!keywords) {
    return false
  }
  let py = pinYinChars(text, style)
  if (py && py.toLowerCase().indexOf(keywords.toLowerCase()) !== -1) {
    return true
  }
  return false
}

function pinYinChars(text, style) {
  if (style === Style.FullChars) {
    return pinYin.getFullChars(text)
  } else {
    return pinYin.getCamelChars(text)
  }
}
