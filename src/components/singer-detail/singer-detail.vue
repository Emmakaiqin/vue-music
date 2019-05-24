
<template>
    <transition name="slide">
        <div class="singer-detail"></div>
    </transition>
</template>
<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from '@/api/singer'
import { createSong } from '@/assets/js/song.js'
export default {
    components: {},
    data() {
        return {
            songs: '',
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
                    console.log('_getDetail:', res.data, this.songs)
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
        // 使用对象展开运算符将 getter 混入 computed 对象中
        ...mapGetters(['singer']),
    },
}
</script>
<style lang="stylus" scoped>
@import '~@assets/css/variable'
.singer-detail
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    z-index 100
    background-color $color-background
.slide-enter-active, .slide-leave-active
    transition all 0.3s
.slide-enter, .slide-leave-to
    transform translate3d(100%, 100%, 0)
</style>


