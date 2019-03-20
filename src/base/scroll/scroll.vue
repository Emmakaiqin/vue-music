<template>
    <div class="scroll" ref="scroll">
        <slot>
        </slot>
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
        dada: {
            type: Array,
            default() {
                return []
            }
        }
    },

    data() {
        return {
        }
    },
    mounted() {
        setTimeout(() => {
            this._initScroll()
        }, 20);
    },
    destroyed() {
    },
    methods: {
        _initScroll() {
            if (!this.$refs.scroll) {
                return
            }
            this.scroll = new BScroll(this.$refs.scroll, {
                propoType: this.probeType,
                click: this.click,

            })
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
    },
    watch: {
        data(val, oldval) {
            setTimeout(() => {
                this.refresh()
            }, 20);
        }
    }
}
</script>

<style scoped lang="stylus">
@import '~@assets/css/variable'
</style>