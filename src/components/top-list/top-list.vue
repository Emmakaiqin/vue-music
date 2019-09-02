<template>
    <transition name="slide">
        <music-list :title="title" :rank="true" :bgImage="bgImg" :songs="songs"></music-list>
    </transition>
</template>
<script>
import MusicList from '@components/music-list/music-list'
import { mapGetters } from 'vuex'
import { createSong } from '@/assets/js/song.js'
export default {
    name: 'topList',
    components: {
        MusicList,
    },
    data() {
        return {
            songs: [],
        }
    },
    created() {
        this.getDetail()
        console.log(this.topList)
    },
    methods: {
        getDetail() {
            if (!this.topList.song || !this.topList.song.length) {
                // 无数据返回上一级
                this.$router.push('/rank')
                return
            }
            this.songs = this.normalizeSongs(this.topList.song)
        },
        normalizeSongs(list) {
            let ret = []
            list.forEach((musicData, index) => {
                musicData.songid = musicData.songId
                musicData.songmid = musicData.singerMid
                musicData.albumname = musicData.singerName
                musicData.songname = musicData.title
                musicData.albummid = musicData.albumMid
                ret.push(createSong(musicData, index))
            })
            return ret
        },
    },
    computed: {
        title() {
            return this.topList.title || ''
        },
        bgImg() {
            return this.topList.mbFrontPicUrl || ''
        },
        ...mapGetters(['topList']),
    },
}
</script>
<style lang="stylus" scoped>
@import '~@assets/css/variable'
@import '~@assets/css/mixin'
.top-list
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    z-index 100
    background-color $color-background
</style>


