<template>
    <div class="scroll" ref="scroll">
        <slot> </slot>
    </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
    name: 'scroll',
    props: {
        probeType: {
            type: Number,
            default: 1,
        },
        click: {
            type: Boolean,
            default: true,
        },
        data: {
            type: Array,
            default: null,
        },
        listenScroll: {
            // 是否监听滚动事件
            type: Boolean,
            default: false,
        },
        pullup: {
            // 是否上拉加载
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {}
    },
    mounted() {
        setTimeout(() => {
            this._initScroll()
        }, 20)
    },
    destroyed() {},
    methods: {
        _initScroll() {
            if (!this.$refs.scroll) {
                return
            }
            this.scroll = new BScroll(this.$refs.scroll, {
                probeType: this.probeType,
                click: this.click,
            })
            if (this.listenScroll) {
                //监听高度变化
                this.scroll.on('scroll', pos => {
                    this.$emit('scroll', pos)
                })
            }
            if (this.pullup) {
                //  上拉加载
                this.scroll.on('scrollEnd', () => {
                    if (this.scroll.y <= this.scroll.maxScrollY + 50) {
                        this.$emit('scrollToEnd')
                    }
                })
            }
        },
        enable() {
            this.scroll && this.scroll.enable()
        },
        disable() {
            this.scroll && this.scroll.disable()
        },
        refresh() {
            this.scroll && this.scroll.refresh()
        },
        scrollTo() {
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        scrollToElement() {
            //滚动到指定元素
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        },
    },
    watch: {
        data(val, oldval) {
            setTimeout(() => {
                this.refresh()
            }, 20)
        },
    },
}
</script>

<style scoped lang="stylus">
@import '~@assets/css/variable'
</style>