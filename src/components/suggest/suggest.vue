<template>
    <scroll ref="suggest" class="suggest" :data="result" :pullup="pullup" @scrollToEnd="pullUpLoad">
        <ul class="suggest-list" v-show="result && result.length">
            <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="'result' + index">
                <div class="icon">
                    <i :class="getIconClass(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="pullupCount < pullupMax && result.length > 15" title=""></loading>
        </ul>
        <div v-show="!result || !result.length" class="no-result-wrapper">抱歉，暂无搜索结果...</div>
    </scroll>
</template>
<script>
const TYPE_SINGER = 'singer'
const PULLUP_MAX = 3 // 模拟下拉加载允许下拉的次数
import discList from '@components/recommend/discList.json'
import { matchKeywords } from '@/assets/js/util'
import Scroll from '@base/scroll/scroll'
import Loading from '@base/loading/loading'
import Singer from '@/assets/js/singer'
import { mapMutations } from 'vuex'
export default {
    name: 'suggest',
    components: {
        Scroll,
        Loading,
    },
    data() {
        return {
            result: [],
            discList: [],
            pullup: true, // 下拉刷新
            pullupCount: 0, // 下拉次数
            pullupMax: PULLUP_MAX,
        }
    },
    props: {
        showSinger: {
            // 显示歌手
            default: true,
            type: Boolean,
        },
        query: {
            // 查询key
            type: String,
            default: '',
        },
    },
    watch: {
        query(val, oldVal) {
            let arr = []
            this.pullupCount = 0 // 下拉加载次数清空一下
            this.$nextTick(() => {
                this.$refs.suggest.scrollTo(0, 0)
            }, 20)
            this.discList.forEach(item => {
                if (item.type == 'TYPE_SINGER') {
                    // 歌手类型
                    if (matchKeywords(item.album.name, val)) {
                        arr.push(item)
                    }
                } else {
                    // 歌曲类型
                    if (matchKeywords(item.singerName, val)) {
                        arr.push(item)
                    }
                }
            })
            this.result = arr
        },
    },
    created() {
        this.getDiscList() //歌单数据
    },
    methods: {
        selectItem(item) {
            // 点击项
            console.log('selectItem', item)
            if (item.type == TYPE_SINGER) {
                let singer = new Singer({ id: item.singerMid, name: item.singerName })
                this.$router.push({ path: `/search/${item.singerMid}` })
                this.setSinger(singer)
            } else {
            }
        },
        pullUpLoad() {
            // 上拉加载 模拟筛选数据大于15且上拉前三次才加载
            if (this.pullupCount < PULLUP_MAX && this.result && this.result.length > 15) {
                this.result.push(...this.result) // 扩展运算符（...）
                this.pullupCount++
            }
        },
        filterText(search, arr) {
            return arr
        },
        getIconClass(item) {
            // 获取icon
            if (item.type == TYPE_SINGER) {
                return 'icon-mine'
            } else {
                return 'icon-music'
            }
        },
        getDisplayName(item) {
            if (item.type == TYPE_SINGER) {
                return `${item.singerName}`
            } else {
                return `${item.album.name}-${item.singerName}`
            }
        },
        getDiscList() {
            let list = JSON.parse(JSON.stringify(discList.list))
            this.discList = list.map((item, index) => {
                let { album, url, singer } = item
                //图片地址
                album.img = 'https://y.gtimg.cn/music/photo_new/T002R300x300M000' + album.mid + '.jpg'
                let singerName = ''
                let singerMid = ''
                singer.forEach((item, index) => {
                    if (item && item.name) {
                        if (index == 0) {
                            singerName = item.name
                            singerMid = item.mid
                        } else {
                            singerName = singerName + '/' + item.name
                        }
                    }
                })
                let type = index % 3 == 1 ? 'singer' : 'song' // 随机生成歌手和歌曲类型
                return { album, url, singerName, singer, type, singerMid }
            })
            console.log(this.discList)
        },
        ...mapMutations({
            setSinger: 'SET_SINGER',
        }),
    },
}
</script>
<style lang="stylus" scoped>
@import '~@assets/css/variable'
@import '~@assets/css/mixin'
.suggest
    height 100%
    overflow hidden
    .suggest-list
        padding 0 30px
        .suggest-item
            display flex
            align-items center
            padding-bottom 20px
        .icon
            flex 0 0 30px
            width 30px
            [class^='icon-']
                font-size 14px
                color $color-text-d
        .name
            flex 1
            font-size $font-size-medium
            color $color-text-d
            overflow hidden
            .text
                no-wrap()
    .no-result-wrapper
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
        text-align center
        font-size 14px
        color $text-color-d
</style>