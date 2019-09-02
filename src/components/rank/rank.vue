<template>
    <div class="rank" ref="rank">
        <scroll :data="topList" class="topList" ref="topList">
            <div class="toplist" ref="rank">
                <ul>
                    <li
                        class="item"
                        v-for="(item, index) in topList"
                        :key="index + 'topList'"
                        @click="selectItem(item)"
                    >
                        <div class="icon">
                            <img width="100" height="100" v-lazy="item.headPicUrl" />
                        </div>
                        <ul class="songlist">
                            <li class="song" v-for="(item, i) in item.song" :key="i + 'songlist'">
                                <span>{{ i + 1 }}</span>
                                <span>{{ item.title }}-{{ item.singerName }}</span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>
<script>
import Scroll from '@/base/scroll/scroll'
import rankList from './rank.json'
import { playlistMixin } from '@/assets/js/mixin'
import { mapMutations } from 'vuex'
export default {
    name: 'Rank',
    mixins: [playlistMixin],
    components: {
        Scroll,
    },
    data() {
        return {
            topList: [],
        }
    },
    created() {
        this.getTopList()
        console.log(rankList)
    },
    methods: {
        selectItem(item) {
            // 选择一个排行榜
            this.$router.push({ path: `/rank/${item.topId}` })
            this.setTopList(item)
        },
        getTopList() {
            this.topList = rankList.toplist
        },
        handlePlaylist(playList) {
            // 设置底部高度
            console.log(1)
            const bottom = playList.length > 0 ? '60px' : ''
            this.$refs.rank.style.bottom = bottom
            this.$refs.topList.refresh()
        },
        ...mapMutations({
            setTopList: 'SET_TOP_LIST', // 设置排行榜
        }),
    },
}
</script>
<style lang="stylus" scoped>
@import '~@assets/css/variable'
@import '~@assets/css/mixin'
.rank
    position fixed
    width 100%
    top 88px
    bottom 0px
    .topList
        height 100%
        overflow hidden
        .item
            display flex
            margin 0 20px
            padding-top 20px
            height 100px
            &:last-child
                padding-bottom 20px
            .icon
                felx 0 0 100px
                width 100px
                height 100px
            .songlist
                flex 1
                display flex
                flex-direction column
                justify-content center
                padding 0 20px
                height 100px
                overflow hidden
                background $color-highlight-background
                color $color-text-d
                font-size $font-size-small
                .song
                    no-wrap()
                    line-height 26px
</style>

