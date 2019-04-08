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
                    <li v-for="(item, index) in group.items" :key="'item.singer_mid' + index" class="list-group-item">
                        <img class="avatar" :src="item.singer_pic" />
                        <span class="name">{{ item.singer_name }}</span>
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
    </scroll>
</template>
<script>
import Scroll from '@base/scroll/scroll'
import { getData } from '@/assets/js/dom.js'

const ANCHOR_HEIGHT = 18 //初始高度 一个索引样式高度为18

export default {
    created() {
        this.touch = {} //data中数据会不监听变化 ?????
        this.listenScroll = true
        this.listenHeight = []
        this.probeType = 3
    },
    mounted() {
        this._calculateHeight()
    },
    data() {
        return {
            //data中数据会监听变化
            scrollY: -1, // 监听y轴滚动变化
            currentIndex: 0, // 当前显示第几个 高亮
        }
    },
    components: {
        Scroll,
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
    },
    methods: {
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
            console.log('scroll begin')
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
            if (index < 0) {
                index = 0
            } else if (index > this.listenHeight.length - 2) {
                index = this.listenHeight.length - 2
            }
            this.scrollY = -this.listenHeight[index]
            this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
        },
    },
    watch: {
        scrollY(newy) {
            const listenHeight = this.listenHeight
            for (let i = 0; i < listenHeight.length; i++) {
                let height1 = listenHeight[i]
                let height2 = listenHeight[i + 1]
                if (!height2 || (-newy > height1 && -newy < height2)) {
                    this.currentIndex = i
                    return
                }
            }
            this.currentIndex = 0
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
</style>

