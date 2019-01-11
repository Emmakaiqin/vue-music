<template>
    <div class="recommend">
        <div class="recommend-content">
            <div class="recommend-wrapper"></div>
        </div>
        <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul></ul>
        </div>
    </div>
</template>
<script>
import { getRecommend } from "@/api/recommend"
import { ERR_OK } from "@/api/config"
export default {
    created() {
        this._getRecommend()//获取数据
    },
    methods: {
        _getRecommend() {
            getRecommend().then((res) => {
                if (res.code === ERR_OK) {
                    console.log('recommend数据:', res.data)
                }
            })
        }
    },
}
</script>
<style lang="stylus" scoped>
@import '~@assets/css/variable'
.recommend
    position fixed
    width 100%
    top 88px
</style>

