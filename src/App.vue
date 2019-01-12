<template>
    <div id="app">
        <m-header></m-header>
        <m-tab></m-tab>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>

    </div>
</template>

<script>
import MHeader from '@components/m-header/m-header'
import MTab from '@components/tab/tab'

export default {
    name: 'App',
    components: {
        MHeader,
        MTab
    }
}
</script>

<style lang="stylus">
</style>
