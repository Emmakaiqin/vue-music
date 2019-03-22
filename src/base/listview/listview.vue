<template>
    <scroll class='listview'>
        <ul class='list-group' v-for="(group,i) in data" :key='i'>
            <li v-for='(item,index) in group.items' :key='"item.singer_mid"+index'>
                <img class='avatar' :src='item.singer_pic'>
                <span class='name'>{{item.singer_name}}</span>
            </li>
        </ul>
    </scroll>
</template>
<script>
import Scroll from "@base/scroll/scroll";
export default {
    components: {
        Scroll
    },
    props: {
        data: {
            type: Array,
            default() {
                return []
            }
        }
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
    .list-goup
        height 30px
        line-height 30px
</style>

