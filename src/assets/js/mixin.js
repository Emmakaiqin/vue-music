import { mapGetters } from 'vuex'
export const playlistMixin = {
  computed: {
    ...mapGetters(['playList']),
  },
  mounted() {
    // dom ready 以后
    this.handlePlaylist(this.playList)
  },
  activated() {
    // keep-alive的时候
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlaylist(newVal)
    },
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    },
  },
}
