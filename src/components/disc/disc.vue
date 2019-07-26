<template>
    <transition name="disc-slide">
        <music-list :bgImage="bgImage" :title="title" :songs="songlist"></music-list>
    </transition>
</template>

<script>
import MusicList from '@components/music-list/music-list'
import list from './list.json'
import { mapGetters } from 'vuex'
import { createSong } from '@/assets/js/song.js'
export default {
    name: 'Disc',
    components: {
        MusicList,
    },
    created() {
        this.getDisc()
    },
    data() {
        return {
            songlist: [],
        }
    },
    methods: {
        getDisc() {
            if (!this.disc || !this.disc.album || !this.disc.album.id) {
                // 无数据返回上一级
                this.$router.push('/recommend')
                return
            }
            this.songlist = this._normalizeSongs(JSON.parse(JSON.stringify(list.songlist)))
        },
        _normalizeSongs(list) {
            let ret = []
            list.forEach((musicData, index) => {
                musicData.songid = musicData.id
                musicData.songmid = musicData.ksong.mid
                musicData.albumname = musicData.album.name
                musicData.songname = musicData.name
                musicData.albummid = musicData.album.mid
                ret.push(createSong(musicData, index))
            })
            return ret
        },
    },
    computed: {
        title() {
            if (this.disc && this.disc.album && this.disc.album.title) {
                return this.disc.album.title
            }
            return ''
        },
        bgImage() {
            if (this.disc && this.disc.album && this.disc.album.img) {
                return this.disc.album.img
            }
            return ''
        },
        ...mapGetters(['disc']),
    },
}
</script>
<style scoped lang="stylus">
@import '~@assets/css/variable'
@import '~@assets/css/mixin'
.disc-slide-enter-active, .disc-slide-leave-active
    transition all 0.3s
.disc-slide-enter, .disc-slide-leave-to
    transform translate3d(100%, 0, 0)
</style>

