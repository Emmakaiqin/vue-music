
<template>
    <div class="recommend" ref="recommend">
        <scroll ref="scrolls" class="recommend-content" :data="discList">
            <div>
                <div class="slider-wrapper" v-if="recommends.length">
                    <slider>
                        <div v-for="item in recommends" :key="item.id">
                            <a :href="item.linkUrl">
                                <img :src="item.picUrl" />
                            </a>
                        </div>
                    </slider>
                </div>
                <div class="recommend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul>
                        <li v-for="item in discList" :key="item.album.id" class="item" @click="selectItem(item)">
                            <div class="icon">
                                <!--fastclick属性--needsclick,避免与BScroll click冲突-->
                                <img
                                    width="60"
                                    class="needsclick"
                                    @load="loadImg()"
                                    height="60"
                                    v-lazy="item.album.img"
                                    alt="..."
                                />
                            </div>
                            <div class="text">
                                <h2 class="name">{{ item.album.name }}</h2>
                                <p class="desc">{{ item.singerName }}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading-container" v-show="!discList">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>
<script>
import Scroll from '@/base/scroll/scroll'
import Slider from '@/base/slider/slider'
import Loading from '@/base/loading/loading'
import { getRecommend, getDiscList } from '@/api/recommend'
import { ERR_OK } from '@/api/config'
import { playlistMixin } from '@/assets/js/mixin'
import discList from './discList.json'
import { mapMutations } from 'vuex'
export default {
    mixins: [playlistMixin],
    data() {
        return {
            recommends: [],
            discList: [],
            isLoaded: false,
        }
    },
    created() {
        this._getRecommend() //轮播获取数据
        this._getDiscList() //歌单数据
    },
    components: {
        Slider,
        Scroll,
        Loading,
    },
    methods: {
        handlePlaylist(playList) {
            const bottom = playList.length > 0 ? '60px' : ''
            this.$refs.recommend.style.bottom = bottom
            this.$refs.scrolls.refresh()
        },
        selectItem(item) {
            //
            console.log('selectItem:', item)
            this.$router.push({ path: `/recommend/${item.album.mid}` })
            this.setDisc(item)
        },
        loadImg() {
            if (!this.isLoaded) {
                //第一次图片加载时刷新让BScroll滚动获取到轮播图的高度
                this.$refs.scrolls.refresh()
                this.isLoaded = true
            }
        },
        _getRecommend() {
            getRecommend().then(res => {
                if (res.code === ERR_OK) {
                    this.recommends = res.data.slider
                }
            })
        },
        _getDiscList() {
            let list = JSON.parse(JSON.stringify(discList.list))
            this.discList = list.map(item => {
                let { album, url, singer } = item
                //图片地址
                album.img = 'https://y.gtimg.cn/music/photo_new/T002R300x300M000' + album.mid + '.jpg'
                let singerName = singer.map(item => {
                    return item.name || ''
                })
                singerName = singerName.join(' ')
                return { album, url, singerName }
            })
        },
        ...mapMutations({
            setDisc: 'SET_DISC',
        }),
    },
}
</script>
<style lang="stylus" scoped>
@import '~@assets/css/variable'
.recommend
    position fixed
    width 100%
    top 88px
    bottom 0
    .recommend-content
        height 100%
        overflow hidden
        .slider-wrapper
            position relative
            width 100%
            overflow hidden
        .recommend-list
            .list-title
                height 65px
                line-height 65px
                text-align center
                font-size $font-size-medium
                color $color-theme
            .item
                display flex
                box-sizing border-box
                align-items center
                padding 0 20px 20px 20px
                .icon
                    flex 0 0 60px
                    width 60px
                    padding-right 20px
                .text
                    display flex
                    flex-direction column
                    justify-content center
                    flex 1
                    line-height 20px
                    overflow hidden
                    font-size $font-size-medium
                    .name
                        margin-bottom 10px
                        color $color-text
                    .desc
                        color $color-text-d
        .loading-container
            position absolute
            width 100%
            top 50%
            transform translateY(-50%)
</style>

