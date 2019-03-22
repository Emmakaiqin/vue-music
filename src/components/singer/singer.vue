
<template>
    <div class="singer">
        <list-view :data='singers'></list-view>
    </div>
</template>
<script>
import singer from "./singer.json"
import ListView from "@/base/listview/listview"
const HOTE_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
    components: {
        ListView
    },
    data() {
        return {
            singers: []
        }
    },
    created() {
        this._getSingerList()
    },
    methods: {
        _getSingerList() {
            let list = JSON.parse(JSON.stringify(singer))
            console.log(singer)
            this.singers = this._normazileSingers(list.singerlist)
            console.log(this.singers)
        },
        _normazileSingers(list) {
            let map = {
                hot: {
                    title: HOTE_NAME,
                    items: []
                }
            }
            list.forEach((item, index) => {
                if (index < HOT_SINGER_LEN) {
                    //前面的定义为热门
                    map.hot.items.push(item)
                } else {
                    //根据姓氏排序
                    const key = item.name_index
                    if (!map[key]) {
                        map[key] = {
                            title: key,
                            items: []
                        }
                    }
                    map[key].items.push(item)
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
                    les.push(val)
                }

            }
            ret.sort((a, b) => {
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            return hot.concat(ret).concat(les)
        }
    }
}
</script>
<style lang="stylus" scoped>

.singer
    position fixed
</style>

