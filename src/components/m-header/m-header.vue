<template>
    <div class="m-header">
        <div class="icon"></div>
        <h1 class="text">Emma Music</h1>
    </div>
</template>
<script>
export default {
    name: 'MHeader',
    data() {
        return {
            msg: ''
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import '~@assets/css/variable'
@import '~@assets/css/mixin'
.m-header
    position relative
    height 44px
    text-align center
    font-size 0
    color $color-theme
    .icon
        display inline-block
        vertical-align top
        margin-top 6px
        width 30px
        height 32px
        margin-right 9px
        background-size 100% 100%
        bg-image('logo')
    .text
        display inline-block
        vertical-align top
        line-height 44px
        font-size $font-size-large
</style>
