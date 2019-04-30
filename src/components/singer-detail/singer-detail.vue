
<template>
    <transition name="slide">
        <div class="singer-detail"></div>
    </transition>
</template>
<script>
export default {
    components: {},
    data() {
        return {}
    },
    created() {},
    methods: {},
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


