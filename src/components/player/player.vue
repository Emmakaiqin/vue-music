<template>
    <div class="player" v-if="playList && playList.length && currentSong">
        <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img width="100%" height="100%" :src="currentSong.image" />
                </div>
                <div class="top">
                    <div class="back" @click="doFullScreen(false)">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title">{{ currentSong.name }}</h1>
                    <h1 class="subtitle">{{ currentSong.singer }}</h1>
                </div>
                <div
                    class="middle"
                    @touchstart.prevent="middleTouchStart"
                    @touchmove.prevent="middleTouchMove"
                    @touchend="middleTouchEnd"
                >
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" :class="cdCls">
                                <img class="image" :src="currentSong.image" />
                            </div>
                        </div>
                    </div>
                    <template v-if="currentLyric">
                        <scroll class="middle-r" ref="lyricList" :data="currentLyric.lines">
                            <div class="lyric-wrapper">
                                <div v-if="currentLyric">
                                    <p
                                        ref="lyricLine"
                                        class="text"
                                        :class="{ current: currentLineNum === index }"
                                        v-for="(line, index) in currentLyric.lines"
                                        :key="index + 'lyric'"
                                    >
                                        {{ line.txt }}
                                    </p>
                                </div>
                            </div>
                        </scroll>
                    </template>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{ active: currentShow == 'cd' }"></span>
                        <span class="dot" :class="{ active: currentShow == 'lycir' }"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{ format(currentTime) }}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :precent="precent" @precentChange="progressBarChange"></progress-bar>
                        </div>
                        <span class="time time-r">{{ format(currentSong.duration) }}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left" @click="changeMode">
                            <i :class="iconMode"></i>
                        </div>
                        <div class="icon i-left">
                            <i @click="prev" class="icon-prev"></i>
                        </div>
                        <div class="icon i-center">
                            <i @click="togglePLay" :class="playIcon"></i>
                        </div>
                        <div class="icon i-right">
                            <i @click="next" class="icon-next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon icon-not-favorite"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="doFullScreen(true)">
                <div class="icon">
                    <img width="40" :class="cdCls" height="40" :src="currentSong.image" />
                </div>
                <div class="text">
                    <h2 class="name">{{ currentSong.name }}</h2>
                    <p class="desc">{{ currentSong.singer }}</p>
                </div>
                <div class="control">
                    <progress-circle :raduis="32" :precent="precent">
                        <i @click.stop="togglePLay" class="icon-mini" :class="miniIcon"></i>
                    </progress-circle>
                </div>
                <div class="control">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <audio
            ref="audio"
            :src="currentSong.url"
            @canplay="ready"
            @error="error"
            @timeupdate="updateTime"
            @ended="end"
        ></audio>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from '@/assets/js/dom'
import ProgressBar from '@/base/progress-bar/progress-bar'
import ProgressCircle from '@/base/progress-circle/progress-circle'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
import { playMode } from '@assets/js/config.js' // 播放模式
import { shuffle } from '@assets/js/util.js' // 播放模式
import Lyric from 'lyric-parser'
import Scroll from '@/base/scroll/scroll'

export default {
    name: 'Player',
    data() {
        return {
            songReady: false, // 歌曲准备好没
            currentTime: 0, // 当前播放时间
            currentLyric: '', // 当前歌词
            currentLineNum: 0, // 当前歌词所在行
            currentShow: 'cd', // 展示的列表 lycir--歌词
        }
    },
    created() {
        this.touch = {} // 触摸事件 不需要getter和setter
    },
    components: {
        Scroll,
        ProgressBar,
        ProgressCircle,
    },
    computed: {
        iconMode() {
            return this.mode === playMode.sequence
                ? 'icon-sequence'
                : this.mode === playMode.loop
                ? 'icon-loop'
                : 'icon-random'
        },
        disabledCls() {
            // 不可点击样式
            return this.songReady ? '' : 'disable'
        },
        cdCls() {
            return this.playing ? 'play' : 'play pause'
        },
        playIcon() {
            return this.playing ? 'icon-pause' : 'icon-play'
        },
        miniIcon() {
            return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
        },
        precent() {
            return this.currentTime / this.currentSong.duration || 0
        },
        ...mapGetters(['playList', 'fullScreen', 'currentSong', 'playing', 'currentIndex', 'mode', 'sequenceList']),
    },
    methods: {
        progressBarChange(precent) {
            this.$refs.audio.currentTime = precent * this.currentSong.duration
            if (!this.playing) {
                // 暂停的话就播放
                this.togglePLay()
            }
        },
        doFullScreen(bool) {
            this.setFullScreen(bool)
        },
        enter(el, done) {
            let { x, y, scale } = this.getPosAndScale()

            let animation = {
                0: {
                    transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
                },
                60: {
                    transform: `translate3d(0,0,0) scale(1.1)`,
                },
                100: {
                    transform: `translate3d(0,0,0) scale(1)`,
                },
            }
            animations.registerAnimation({
                name: 'move',
                animation,
                presets: {
                    duration: 400,
                    easing: 'linear',
                },
            })
            animations.runAnimation(this.$refs.cdWrapper, 'move', done)
        },
        afterEnter() {
            //  done完注销
            animations.unregisterAnimation('move')
            this.$refs.cdWrapper.style.animations = ''
        },
        leave(el, done) {
            this.$refs.cdWrapper.style.transition = 'all 0.4s'
            const { x, y, scale } = this.getPosAndScale()
            this.$refs.cdWrapper.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`
            this.$refs.cdWrapper.addEventListener('transitionend', done) // 动画结束 执行done回调,到afterLeave()函数
        },
        afterLeave() {
            this.$refs.cdWrapper.style.transition = ''
            this.$refs.cdWrapper.style.transform = ''
        },
        // 获取位置和缩放
        getPosAndScale() {
            // 小图
            const targetWidth = 40
            const paddingLeft = 20
            const paddingBottom = 30

            // 大图
            const paddingTop = 80
            const width = window.innerWidth * 0.8

            const scale = targetWidth / width

            const x = -(window.innerWidth / 2 - paddingLeft)
            const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
            return {
                x,
                y,
                scale,
            }
        },
        changeMode() {
            const mode = (this.mode + 1) % 3
            this.setPlayMode(mode)
            let list = []
            if (mode == playMode.random) {
                // 随机一下
                list = shuffle(this.sequenceList)
            } else {
                list = this.sequenceList
            }
            this.resetCurrentIndex(list)
            this.setPlayList(list)
        },
        resetCurrentIndex(list) {
            let index = list.findIndex(item => {
                return item.id == this.currentSong.id
            })
            if (index >= 0) {
                this.setCurrentIndex(index)
            }
        },
        end() {
            console.log(this.mode)
            if (this.mode === playMode.loop) {
                this.loop()
            } else {
                this.next()
            }
        },
        ready() {
            this.songReady = true
        },
        error() {
            this.songReady = false
        },
        togglePLay() {
            this.setPlayingState(!this.playing)
        },
        loop() {
            this.$refs.audio.currentTime = 0
            this.$refs.audio.play()
        },
        next() {
            if (!this.songReady) {
                return
            }
            let index = this.currentIndex + 1
            console.log(1, this.songReady, index)
            if (index === this.playList.length) {
                index = 0
            }
            this.setCurrentIndex(index)
            if (!this.playing) {
                this.togglePLay()
            }
            // 歌曲准备好置为false
            this.songReady = true
        },
        prev() {
            // 没有准备好歌曲就不切换
            if (!this.songReady) {
                return
            }
            let index = this.currentIndex - 1
            if (index === -1) {
                index = this.playList.length - 1
            }
            this.setCurrentIndex(index)
            if (!this.playing) {
                this.togglePLay()
            }
            this.songReady = false
        },
        updateTime(e) {
            this.currentTime = e.target.currentTime
        },
        format(interval = 0) {
            const minute = parseInt(interval / 60)
            const second = parseInt(interval % 60)
            return this._pad(minute) + ':' + this._pad(second)
        },
        getLyric() {
            this.currentLyric = new Lyric(this.currentSong.text, this.handleLyric)
            if (this.playing) {
                this.currentLyric.play()
            }
        },
        handleLyric({ lineNum, txt }) {
            this.currentLineNum = lineNum
            if (lineNum > 5) {
                let lineEl = this.$refs.lyricLine[lineNum - 5] //  滚动到当前元素偏移第五个
                this.$refs.lyricList.scrollToElement(lineEl, 1000)
            } else {
                // 5行之内直接滚动到顶部
                this.$refs.lyricList.scrollTo(0, 0, 1000)
            }
        },

        middleTouchStart(e) {
            this.touch.initiated = true
            // 用来判断是否是一次移动
            this.touch.moved = false
            const touch = e.touches[0]
            this.touch.startX = touch.pageX
            this.touch.startY = touch.pageY
        },
      middleTouchMove(e) {
            if (!this.touch.initiated) {
            return
            }
            const touch = e.touches[0]
            const deltaX = touch.pageX - this.touch.startX
            const deltaY = touch.pageY - this.touch.startY
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                // 纵轴滚动偏差大于横轴 什么都不做,认为是纵轴滚动
                return
            }
            if (!this.touch.moved) {
                this.touch.moved = true
            }
            const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
            //  window.innerWidth 屏幕宽度 不能超出屏幕宽度
            const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
            this.touch.precent = Math.abs(offsetWidth / window.innerWidth)
            this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0))`
            this.$refs.lyricList.$el.style.transitionDuration = 0
            this.$refs.middleL.style.opacity = 1 - this.touch.precent
            this.$refs.middleL.style.transitionDuration = 0
        },
        middleTouchEnd(e) {
                    if (!this.touch.moved) {
          return
        }
            // 决定滚动的位置 从右往左   从左往右
            let offsetWidth
            let opacity
            if (this.currentShow == 'cd') {
                if (this.touch.precent > 0.1) {
                    // 划过10%
                    opacity = 0
                    offsetWidth = -window.innerWidth
                    this.currentShow = 'lycir'
                } else {
                    offsetWidth = 0
                    opacity = 1
                }
            } else {
                if (this.touch.precent < 0.9) {
                    // 划过10%
                    offsetWidth = 0
                    opacity = 1
                    this.currentShow = 'cd'
                } else {
                    offsetWidth = -window.innerWidth
                    opacity = 0
                }
            }
            const time = 300
            this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0))`
            this.$refs.lyricList.$el.style.transitionDuration = `${time}ms`
            this.$refs.middleL.style.opacity = opacity
            this.$refs.middleL.style.transitionDuration = `${time}ms`
        },
        _pad(num, n = 2) {
            let len = num.toString().length
            while (len < n) {
                num = '0' + num
                len++
            }
            return num
        },
        ...mapMutations({
            setFullScreen: 'SET_FULL_SCREEN',
            setPlayingState: 'SET_PLAYING_STATE',
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAY_LIST',
        }),
    },
    watch: {
        currentSong(newSong, oldSong) {
            if (!newSong || !newSong.id) {
                return
            }
            if (oldSong && newSong.id === oldSong.id) {
                // 模式切换不触发歌曲数据改变
                return
            }
            this.$nextTick(() => {
                this.$refs.audio.play()
                // this.currentSong.getLyric()
                this.getLyric()
            })
        },
        playing(newval) {
            this.$nextTick(() => {
                const audio = this.$refs.audio
                newval ? audio.play() : audio.pause()
            })
        },
    },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
@import '~@assets/css/variable'
@import '~@assets/css/mixin'
.player
    .normal-player
        position fixed
        left 0
        right 0
        top 0
        bottom 0
        z-index 150
        background $color-background
        .background
            position absolute
            left 0
            top 0
            width 100%
            height 100%
            z-index -1
            opacity 0.6
            filter blur(20px)
        .top
            position relative
            margin-bottom 25px
            .back
                position absolute
                top 0
                left 6px
                z-index 50
                .icon-back
                    display block
                    padding 9px
                    font-size $font-size-large-x
                    color $color-theme
                    transform rotate(-90deg)
            .title
                width 70%
                margin 0 auto
                line-height 40px
                text-align center
                no-wrap()
                font-size $font-size-large
                color $color-text
            .subtitle
                line-height 20px
                text-align center
                font-size $font-size-medium
                color $color-text
        .middle
            position fixed
            width 100%
            top 80px
            bottom 170px
            white-space nowrap
            font-size 0
            .middle-l
                display inline-block
                vertical-align top
                position relative
                width 100%
                height 0
                padding-top 80%
                .cd-wrapper
                    position absolute
                    left 10%
                    top 0
                    width 80%
                    height 100%
                    .cd
                        width 100%
                        height 100%
                        box-sizing border-box
                        border 10px solid rgba(255, 255, 255, 0.1)
                        border-radius 50%
                        &.play
                            animation rotate 20s linear infinite
                        &.pause
                            animation-play-state paused
                        .image
                            position absolute
                            left 0
                            top 0
                            width 100%
                            height 100%
                            border-radius 50%
                .playing-lyric-wrapper
                    width 80%
                    margin 30px auto 0 auto
                    overflow hidden
                    text-align center
                    .playing-lyric
                        height 20px
                        line-height 20px
                        font-size $font-size-medium
                        color $color-text-l
            .middle-r
                display inline-block
                vertical-align top
                width 100%
                height 100%
                overflow hidden
                .lyric-wrapper
                    width 80%
                    margin 0 auto
                    overflow hidden
                    text-align center
                    .text
                        line-height 32px
                        color $color-text-l
                        font-size $font-size-medium
                        &.current
                            color $color-text
        .bottom
            position absolute
            bottom 50px
            width 100%
            .dot-wrapper
                text-align center
                font-size 0
                .dot
                    display inline-block
                    vertical-align middle
                    margin 0 4px
                    width 8px
                    height 8px
                    border-radius 50%
                    background $color-text-l
                    &.active
                        width 20px
                        border-radius 5px
                        background $color-text-ll
            .progress-wrapper
                display flex
                align-items center
                width 80%
                margin 0px auto
                padding 10px 0
                .time
                    color $color-text
                    font-size $font-size-small
                    flex 0 0 30px
                    line-height 30px
                    width 30px
                    &.time-l
                        text-align left
                    &.time-r
                        text-align right
                .progress-bar-wrapper
                    flex 1
            .operators
                display flex
                align-items center
                .icon
                    flex 1
                    color $color-theme
                    &.disable
                        color $color-theme-d
                    i
                        font-size 30px
                .i-left
                    text-align right
                .i-center
                    padding 0 20px
                    text-align center
                    i
                        font-size 40px
                .i-right
                    text-align left
                .icon-favorite
                    color $color-sub-theme
        &.normal-enter-active, &.normal-leave-active
            transition all 0.4s
            .top, .bottom
                transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
        &.normal-enter, &.normal-leave-to
            opacity 0
            .top
                transform translate3d(0, -100px, 0)
            .bottom
                transform translate3d(0, 100px, 0)
    .mini-player
        display flex
        align-items center
        position fixed
        left 0
        bottom 0
        z-index 180
        width 100%
        height 60px
        background $color-highlight-background
        &.mini-enter-active, &.mini-leave-active
            transition all 0.4s
        &.mini-enter, &.mini-leave-to
            opacity 0
        .icon
            flex 0 0 40px
            width 40px
            padding 0 10px 0 20px
            img
                border-radius 50%
                &.play
                    animation rotate 10s linear infinite
                &.pause
                    animation-play-state paused
        .text
            display flex
            flex-direction column
            justify-content center
            flex 1
            line-height 20px
            overflow hidden
            .name
                margin-bottom 2px
                no-wrap()
                font-size $font-size-medium
                color $color-text
            .desc
                no-wrap()
                font-size $font-size-small
                color $color-text-d
        .control
            flex 0 0 30px
            width 30px
            padding 0 10px
            .icon-play-mini, .icon-pause-mini, .icon-playlist
                font-size 30px
                color $color-theme-d
            .icon-mini
                font-size 32px
                position absolute
                left 0
                top 0
@keyframes rotate
    0%
        transform rotate(0)
    100%
        transform rotate(360deg)
</style>
