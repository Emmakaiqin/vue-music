<template>
    <div class='loading'>
        <img class="load-icon" src='./loading.gif'>
        <p class='des'>{{title}}</p>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: '加载中...'
        }
    },
}
</script>
<style lang="stylus" scoped>
@import '~@assets/css/variable'
.loading
    width 100%
    text-align center
    .load-icon
        width 24px
        height 24px
    .desc
        line-height 20px
        font-size $font-size-small-s
        color $color-text-l
</style>

