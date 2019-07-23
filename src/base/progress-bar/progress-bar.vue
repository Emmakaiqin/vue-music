<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div
                class="progress-btn-wrapper"
                ref="progressBtn"
                @touchstart="progressTouchStart"
                @touchend="progressTouchEnd"
                @touchmove="progressTouchMove"
            >
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { prefixStyle } from '@/assets/js/dom'
const transform = prefixStyle('transform')
const BTNWIDTH = 16 // 红色按钮宽度
export default {
    props: {
        precent: {
            type: Number,
            default: 0,
        },
    },
    created() {
        // 拖动进度条数据初始化
        this.touch = {}
    },
    watch: {
        precent(newVal) {
            if (newVal >= 0 && !this.touch.initiated) {
                // 有值且不是在拖动的情况下
                const barWidth = this.$refs.progressBar.clientWidth - BTNWIDTH
                const offsetWidth = newVal * barWidth
                this._offSet(offsetWidth)
            }
        },
    },
    methods: {
        progressTouchStart(e) {
            this.touch.initiated = true
            this.touch.startX = e.touches[0].pageX
            this.touch.left = this.$refs.progress.clientWidth
        },
        progressTouchEnd(e) {
            this.touch.initiated = false
            this._triggerPercent()
        },
        progressTouchMove(e) {
            if (!this.touch.initiated) {
                return
            }
            const barWidth = this.$refs.progressBar.clientWidth - BTNWIDTH
            const deltaX = e.touches[0].pageX - this.touch.startX //偏移量
            const offsetWidth = Math.min(barWidth, Math.max(0, this.touch.left + deltaX))
            this._offSet(offsetWidth)
        },
        progressClick(e) {
            // 这里当我们点击progressBtn的时候,e.offsetX不对
            // this._offSet(e.offsetX)
            const rect = this.$refs.progressBar.getBoundingClientRect()
            const offsetWidth = e.pageX - rect.left
            this._offSet(offsetWidth)
            this._triggerPercent()
        },
        _offSet(offsetWidth) {
            this.$refs.progress.style.width = `${offsetWidth}px`
            this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        },
        _triggerPercent() {
            const barWidth = this.$refs.progressBar.clientWidth - BTNWIDTH
            const precent = this.$refs.progress.clientWidth / barWidth
            this.$emit('precentChange', precent)
        },
    },
}
</script>
<style lang="stylus" scoped>
@import '~@assets/css/variable'
.progress-bar
    height 30px
    .bar-inner
        position relative
        top 13px
        height 4px
        background rgba(0, 0, 0, 0.3)
        .progress
            position absolute
            height 100%
            background $color-theme
        .progress-btn-wrapper
            position absolute
            left -8px
            top -13px
            width 30px
            height 30px
            .progress-btn
                position relative
                top 7px
                left 7px
                box-sizing border-box
                width 16px
                height 16px
                border 3px solid $color-text
                border-radius 50%
                background $color-theme
</style>


