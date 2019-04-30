<template>
    <scroll
        class="listview"
        :data="data"
        ref="listview"
        :listenScroll="listenScroll"
        :probeType="probeType"
        @scroll="scroll"
    >
        <ul>
            <div v-for="(group, i) in data" :key="i" class="list-group" ref="listGroup">
                <h2 class="list-group-title">{{ group.title }}</h2>
                <ul>
                    <li
                        v-for="(item, index) in group.items"
                        @click="selectItem(item)"
                        :key="'item.id' + index"
                        class="list-group-item"
                    >
                        <img class="avatar" :src="item.avatar" />
                        <span class="name">{{ item.name }}</span>
                    </li>
                </ul>
            </div>
        </ul>
        <div
            class="list-shortcut"
            @touchstart.stop.prevent="onShortcutTouchStart"
            @touchmove.stop.prevent="onShortcutTouchMove"
            @touchend.stop
        >
            <ul>
                <li
                    class="item"
                    v-for="(title, index) in shortcutList"
                    :key="'list-shortcut' + index"
                    :data-index="index"
                    :class="{ current: currentIndex == index }"
                >
                    {{ title }}
                </li>
            </ul>
        </div>
        <div ref="fixed" class="list-fixed" v-show="fixedTitle">
            <h1 class="fixed-title">{{ fixedTitle }}</h1>
        </div>
        <div class="loading-container" v-show="!data.length">
            <loading></loading>
        </div>
    </scroll>
</template>
<script>
import Scroll from '@base/scroll/scroll'
import { getData } from '@/assets/js/dom.js'
import Loading from '@/base/loading/loading'

const ANCHOR_HEIGHT = 18 //初始高度 一个索引样式高度为18
const TITLE_HEIGHT = 30 // 每个索引标签的高度

export default {
    created() {
        this.touch = {} //data中数据会不监听变化 ?????
        this.listenScroll = true
        this.listenHeight = []
        this.probeType = 3
    },
    data() {
        return {
            //data中数据会监听变化
            scrollY: -1, // 监听y轴滚动变化
            currentIndex: 0, // 当前显示第几个 高亮
            diff: -1, // 当前滚动到title的底部离顶部的距离
        }
    },
    components: {
        Scroll,
        Loading,
    },
    props: {
        data: {
            type: Array,
            default() {
                return []
            },
        },
    },
    computed: {
        shortcutList() {
            let data = this.data.map(item => {
                return item.title.substr(0, 1)
            })
            return data
        },
        fixedTitle() {
            if (this.scrollY > 0) {
                return ''
            }
            return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
        },
    },
    methods: {
        selectItem(item) {
            this.$emit('selectItem', item)
        },
        // 私有方法放下面,共有方法和绑定事件放上面
        onShortcutTouchStart(e) {
            // 获取点击项的索引
            let key = getData(e.target, 'index')
            this.touch.y1 = e.touches[0].pageY
            this.touch.anchorIndex = key //字符串
            this._scrollTo(key)
        },
        onShortcutTouchMove(e) {
            // 滚动切换
            this.touch.y2 = e.touches[0].pageY
            let data = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0 // 相隔多少个索引
            let anchorIndex = parseInt(this.touch.anchorIndex) + data
            this._scrollTo(anchorIndex)
        },
        scroll(pos) {
            this.scrollY = pos.y
        },
        // 计算dom高度
        _calculateHeight() {
            this.listenHeight = []
            const list = this.$refs.listGroup
            let height = 0
            this.listenHeight.push(height)
            for (let i = 0; i < list.length; i++) {
                height += list[i].clientHeight
                this.listenHeight.push(height)
            }
        },
        _scrollTo(index) {
            if (!index && index !== 0) {
                return
            }
            if (index <= 0) {
                // 顶部
                index = 0
            } else if (index > this.listenHeight.length - 2) {
                // 底部 比实际元素多了一个且下标从0开始,所以减2
                index = this.listenHeight.length - 2
            }
            this.scrollY = -this.listenHeight[index]
            this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
        },
    },
    watch: {
        data() {
            setTimeout(() => {
                this._calculateHeight()
            }, 20)
        },
        scrollY(newY) {
            const listenHeight = this.listenHeight
            // 滚动到顶部 newY>0
            if (newY >= 0) {
                this.currentIndex = 0
                return
            }
            // 中间部分滚动
            for (let i = 0; i < listenHeight.length - 1; i++) {
                let height1 = listenHeight[i]
                let height2 = listenHeight[i + 1]
                if (-newY >= height1 && -newY < height2) {
                    this.currentIndex = i
                    this.diff = height2 + newY
                    return
                }
            }
            // 当滚动到底部，且-newY大于最后一个元素的上限
            this.currentIndex = listenHeight.length - 2
        },
        diff(newVal) {
            let fixedTop = newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0
            if (this.fixedTop === fixedTop) {
                return
            }
            this.fixedTop = fixedTop
            this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
        },
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
    .list-group
        padding-bottom 30px
        .list-group-title
            height 30px
            line-height 30px
            padding-left 20px
            font-size $font-size-small
            color $color-text-l
            background $color-highlight-background
        .list-group-item
            display flex
            align-items center
            padding 20px 0 0 30px
            .avatar
                width 50px
                height 50px
                border-radius 50%
            .name
                margin-left 20px
                color $color-text-l
                font-size $font-size-medium
    .list-shortcut
        position absolute
        z-index 30
        right 0
        top 50%
        transform translateY(-50%)
        width 20px
        padding 20px 0
        border-radius 10px
        text-align center
        background $color-background-d
        font-family Helvetica
        .item
            padding 3px
            line-height 1
            color $color-text-l
            font-size $font-size-small
        .current
            color $color-theme
    .list-fixed
        position absolute
        top 0
        left 0
        width 100%
        .fixed-title
            height 30px
            line-height 30px
            padding-left 20px
            font-size $font-size-small
            color $color-text-l
            background $color-highlight-background
</style>

