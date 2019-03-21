<template>
    <div class='listview'>
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
.listview
    position relative
    width 100%
    height 100%
    overflow hidden
    background $color-background
    .list-goup
        height 30px
        line-height 30px
</style>

