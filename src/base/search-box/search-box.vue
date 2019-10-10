<template>
    <div class="search-box">
        <i class="icon-search"></i>
        <input class="box" v-model.trim="query" :placeholder="placeholder" />
        <i @click="query = ''" v-show="query" class="icon-dismiss"></i>
    </div>
</template>
<script>
export default {
    naem: 'searchBox',
    props: {
        placeholder: {
            type: String,
            default: '搜索歌曲,歌手',
        },
    },
    data() {
        return {
            query: '', // 查询的数据
        }
    },
    created() {
        this.$watch('query', newQuery => {
            // 回调方式  与watch一样
            this.$emit('query', newQuery)
        })
    },
    methods: {
        setQuery(query) {
            this.query = query.k
        },
    },
}
</script>
<style lang="stylus" scoped>
@import '~@assets/css/variable'
.search-box
    display flex
    align-items center
    box-sizing border-box
    width 100%
    padding 0 6px
    height 40px
    background-color $color-highlight-background
    .icon-search
        font-size 24px
        color $color-background
    .box
        flex 1
        margin 0 5px
        line-height 18px
        background-color $color-highlight-background
        color $color-text
        font-size $font-size-medium
        &::placeholder
            color $color-text-d
    .icon-dismiss
        font-size 16px
        color $color-background
</style>