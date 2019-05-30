
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
export default {
    components: { MusicList },
    data() {
        return {
            songs: [],
        }
    },
    created() {
        this._getDetail()
        console.log('created:', this.singer)
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
            list.forEach(item => {
                let { musicData } = item
                if (musicData.songid && musicData.albumid) {
                    ret.push(createSong(musicData))
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


