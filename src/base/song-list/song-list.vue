
<template>
    <div class="song-list">
        <ul>
            <li @click="selectItem(item, index)" v-for="(item, index) in songs" :key="index" class="item">
                <div class="rank" v-show="rank">
                    <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
                </div>
                <div class="content">
                    <h2 class="name">{{ item.name }}</h2>
                    <p class="desc">{{ getDesc(item) }}</p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from '@/api/singer'
import { createSong } from '@/assets/js/song.js'
import MusicList from '@components/music-list/music-list'
export default {
    components: { MusicList },
    data() {
        return {}
    },
    created() {},
    methods: {
        getDesc(item) {
            return `${item.singer}·${item.album}`
        },
        getRankCls(index) {},
        getRankText(index) {},
        selectItem(item, index) {
            this.$emit('selectItem', item, index)
        },
    },
    computed: {},
    props: {
        songs: {
            type: Array,
            default() {
                return []
            },
        },
        rank: {
            type: Boolean,
            default: false,
        },
    },
}
</script>
<style lang="stylus" scoped>
@import '~@assets/css/variable'
@import '~@assets/css/mixin'
.song-list
    .item
        display flex
        align-items center
        box-sizing border-box
        height 64px
        font-size $font-size-medium
        // .rank
        // flex 0 0 25px
        // width 25px
        // margin-right 30px
        // text-align center
        // .icon
        // display inline-block
        // width 25px
        // height 24px
        // background-size 25px 24px
        // &.icon0
        // bg-image('first')
        // &.icon1
        // bg-image('second')
        // &.icon2
        // bg-image('third')
        // .text
        // color $color-theme
        // font-size $font-size-large
        .content
            flex 1
            line-height 20px
            overflow hidden
            .name
                no-wrap()
                color $color-text
            .desc
                no-wrap()
                margin-top 4px
                color $color-text-d
</style>


