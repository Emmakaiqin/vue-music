
<template>
    <transition name="singer-slide">
        <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
    </transition>
</template>
<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from '@/api/singer'
import { createSong } from '@/assets/js/song.js'
import MusicList from '@components/music-list/music-list'
import songText from '@assets/json/songText.json'
import { Base64 } from 'js-base64'
export default {
    components: { MusicList },
    data() {
        return {
            songs: [],
        }
    },
    created() {
        this._getDetail()
    },
    methods: {
        _getDetail() {
            if (!this.singer.id) {
                // 无数据返回上一级
                this.$router.push('/singer')
                return
            }
            getSingerDetail(this.singer.id).then(res => {
                if (res.code == 0) {
                    this.songs = this._normalizeSongs(res.data.list)
                }
            })
        },
        _normalizeSongs(list) {
            let ret = []
            let times = [156, 310, 255, 299, 263, 269] // 6个音频对应时间
            list.forEach((item, index) => {
                let { musicData } = item
                if (musicData.songid && musicData.albumid) {
                    let song = createSong(musicData)
                    // 随机下本地6个音频
                    let i = index % 6
                    song.url = require(`@/assets/music/${i}.mp3`)
                    song.duration = times[i]
                    // 歌词
                    if (i == 5) {
                        song.text = Base64.decode(songText[0].lyric)
                    } else {
                        song.text = Base64.decode(songText[i].lyric)
                    }
                    ret.push(song)
                }
            })
            return ret
        },
    },
    computed: {
        title() {
            return this.singer.name
        },
        bgImage() {
            return this.singer.avatar
        },
        // getters获取
        // singer() {
        //     return this.$store.getters.singer
        // },
        // 使用对象展开运算符将 getter 混入 computed 对象中
        ...mapGetters(['singer']),
    },
}
</script>
<style lang="stylus" scoped>
@import '~@assets/css/variable'
.singer-slide-enter-active, .singer-slide-leave-active
    transition all 0.3s
.singer-slide-enter, .singer-slide-leave-to
    transform translate3d(100%, 100%, 0)
</style>


