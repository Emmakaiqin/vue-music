<template>
    <div id="app">
        <m-header></m-header>
        <m-tab></m-tab>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
        <player></player>
    </div>
</template>

<script>
import MHeader from '@components/m-header/m-header'
import Player from '@components/player/player'
import MTab from '@components/tab/tab'

export default {
    name: 'App',
    components: {
        MHeader,
        MTab,
        Player,
    },
}
</script>

<style lang="stylus"></style>
