<template>
    <div class="music-list">
        <div class="back">
            <i class="icon-back" @click="back"></i>
        </div>
        <h1 class="title">{{ title }}</h1>
        <div class="bg-image" :style="bgStyle" ref="bgImg">
            <div class="play-wrapper">
                <div class="play" v-show="songs && songs.length" ref="playBtn">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter" ref="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <scroll
            @scroll="scroll"
            :data="songs"
            :probeType="probeType"
            :listenScroll="listenScroll"
            class="list"
            ref="list"
        >
            <div class="song-list-wrapper">
                <song-list @selectItem="selectItem" :songs="songs"></song-list>
            </div>
        </scroll>
        <div class="loading-container" v-show="!songs || !songs.length">
            <loading></loading>
        </div>
    </div>
</template>
<script>
import Scroll from '@/base/scroll/scroll'
import SongList from '@/base/song-list/song-list'
import Loading from '@/base/loading/loading'
import { prefixStyle } from '@/assets/js/dom'
import { mapActions } from 'vuex'
const RESERVED_HEIGHT = 40
const backdrop = prefixStyle('backdropFilter')
const transform = prefixStyle('transform')
export default {
    name: 'MusicList',
    components: {
        Scroll,
        SongList,
        Loading,
    },
    data() {
        return {
            scrollY: 0,
        }
    },
    props: {
        bgImage: {
            type: String,
            default: '',
        },
        songs: {
            type: Array,
            default() {
                return []
            },
        },
        title: {
            type: String,
            default: '',
        },
    },
    computed: {
        bgStyle() {
            return `background-image:url(${this.bgImage})`
        },
    },
    mounted() {
        this.imageHeighe = this.$refs.bgImg.clientHeight
        this.minTranslateY = -this.imageHeighe + RESERVED_HEIGHT
        this.$refs.list.$el.style.top = `${this.imageHeighe}px`
    },
    created() {
        this.probeType = 3
        this.listenScroll = true
    },
    methods: {
        back() {
            this.$router.push('/singer')
        },
        scroll(pos) {
            this.scrollY = pos.y
        },
        selectItem(item, index) {
            this.selectPlay({ list: this.songs, index })
        },
        ...mapActions(['selectPlay']),
    },
    watch: {
        scrollY(newY) {
            let zIndex = 0
            let paddingTop = '70%'
            let height = 0
            let scale = 1 // 放大缩小
            let blur = 0 // 模糊度
            let display = 'block'
            let translateY = Math.max(this.minTranslateY, newY)
            this.$refs.layer.style.transform = `translate3d(0,${translateY}px,0)`
            const present = Math.abs(newY / this.imageHeighe)
            if (newY > 0) {
                scale = 1 + present
                zIndex = 10
            } else {
                blur = Math.min(20 * present, 20)
            }
            if (newY < this.minTranslateY) {
                zIndex = 10
                paddingTop = 0
                height = `${RESERVED_HEIGHT}px`
                display = 'none'
            }
            this.$refs.filter.style.backdrop = `blur(${blur})`
            this.$refs.bgImg.style.paddingTop = paddingTop
            this.$refs.bgImg.style.height = height
            this.$refs.bgImg.style.zIndex = zIndex
            this.$refs.bgImg.style.transform = `scale(${scale})`
            this.$refs.playBtn.style.display = display
        },
    },
}
</script>
<style lang="stylus" scoped>
@import '~@assets/css/variable'
@import '~@assets/css/mixin'
.music-list
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    z-index 100
    background-color $color-background
    .loading-container
        position absolute
        width 100%
        top 60%
        // transform translateY(-50%)
    .back
        position absolute
        top 0
        left 6px
        z-index 50
        .icon-back
            display block
            padding 10px
            font-size $font-size-large-x
            color $color-theme
    .title
        position absolute
        top 0
        left 10%
        z-index 40
        width 80%
        no-wrap()
        text-align center
        line-height 40px
        font-size $font-size-large
        color $color-text
    .bg-image
        position relative
        width 100%
        height 0
        padding-top 70%
        transform-origin top
        background-size cover
        .play-wrapper
            position absolute
            bottom 20px
            z-index 50
            width 100%
            .play
                box-sizing border-box
                width 135px
                padding 7px 0
                margin 0 auto
                text-align center
                border 1px solid $color-theme
                color $color-theme
                border-radius 100px
                font-size 0
                .icon-play
                    display inline-block
                    vertical-align middle
                    margin-right 6px
                    font-size $font-size-medium-x
                .text
                    display inline-block
                    vertical-align middle
                    font-size $font-size-small
        .filter
            position absolute
            top 0
            left 0
            width 100%
            height 100%
            background rgba(7, 17, 27, 0.4)
    .bg-layer
        position relative
        height 100%
        background $color-background
    .list
        position fixed
        top 0
        bottom 0
        width 100%
        background $color-background
        .song-list-wrapper
            padding 20px 30px
        .loading-container
            position absolute
            width 100%
            top 50%
            transform translateY(-50%)
</style>
