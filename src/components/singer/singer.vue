
<template>
    <div class="singer" ref="singer">
        <list-view :data="singers" @selectItem="selectSinger" ref="singerList"></list-view>
        <router-view></router-view>
    </div>
</template>
<script>
import { getSingerList } from '@/api/singer'
import ListView from '@/base/listview/listview'
import Singer from '@/assets/js/singer'
import { mapMutations } from 'vuex'
import { playlistMixin } from '@/assets/js/mixin'

const HOTE_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
    name: 'Singer',
    mixins: [playlistMixin],
    components: {
        ListView,
    },
    data() {
        return {
            singers: [],
        }
    },
    created() {
        this._getSingerList()
    },
    methods: {
        handlePlaylist(playList) {
            const bottom = playList.length > 0 ? '60px' : ''
            this.$refs.singer.style.bottom = bottom
            this.$refs.singerList.refresh()
        },
        selectSinger(item) {
            this.$router.push({ path: `/singer/${item.id}` })
            this.setSinger(item)
            // commit方法
            // this.$store.commit('SET_SINGER', item)
            // console.log(123, this.$store.state.singer)
        },
        _getSingerList() {
            let list = ''
            getSingerList().then(res => {
                list = res.data
                this.singers = this._normazileSingers(list.list)
            })
        },
        _normazileSingers(list) {
            let map = {
                hot: {
                    title: HOTE_NAME,
                    items: [],
                },
            }
            list.forEach((item, index) => {
                if (index < HOT_SINGER_LEN) {
                    //前面的定义为热门
                    map.hot.items.push(
                        new Singer({
                            name: item.Fsinger_name,
                            id: item.Fsinger_mid,
                        })
                    )
                } else {
                    //根据姓氏排序
                    const key = item.Findex
                    if (!map[key]) {
                        map[key] = {
                            title: key,
                            items: [],
                        }
                    }
                    map[key].items.push(
                        new Singer({
                            name: item.Fsinger_name,
                            id: item.Fsinger_mid,
                        })
                    )
                }
            })
            let hot = []
            let ret = []
            let les = []
            for (let key in map) {
                let val = map[key]
                if (val.title.match(/[a-zA-Z]/)) {
                    ret.push(val)
                } else if (val.title == '热门') {
                    hot.push(val)
                } else {
                    val.title = '#'
                    les.push(val)
                }
            }
            ret.sort((a, b) => {
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            return hot.concat(ret).concat(les)
        },
        ...mapMutations({
            setSinger: 'SET_SINGER',
        }),
    },
}
</script>
<style lang="stylus" scoped>
.singer
    position fixed
    top 88px
    bottom 0
    width 100%
</style>

