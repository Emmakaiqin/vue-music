<template>
    <div class="progress-circle">
        <svg :width="raduis" :height="raduis" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle class="progress-background" :r="50" cx="50" cy="50" fill="transparent"></circle>
            <circle
                class="progress-bar"
                r="50"
                cx="50"
                cy="50"
                fill="transparent"
                :stroke-dasharray="dashArray"
                :stroke-dashoffset="dashOffset"
            ></circle>
            <!-- stroke-dasharray 描边和描边距离 stroke-dashoffset描边偏移 周长314-->
        </svg>
        <slot></slot>
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
        raduis: {
            // 图片显示的大小
            type: Number,
            default: 100,
        },
    },
    data() {
        return {
            dashArray: Math.PI * 100,
        }
    },
    computed: {
        dashOffset() {
            return (1 - this.precent) * this.dashArray
        },
    },
    watch: {},
    methods: {},
}
</script>
<style lang="stylus" scoped>
@import '~@assets/css/variable'
.progress-circle
    position relative
    circle
        stroke-width 8px
        transform-origin center
        &.progress-background
            transform scale(0.9)
            stroke $color-theme-d
        &.progress-bar
            transform scale(0.9) rotate(-90deg)
            stroke $color-theme
</style>


