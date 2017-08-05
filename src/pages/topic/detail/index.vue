<template>
  <iframe class="show" v-bind:src="data" width="100%" height="100%"></iframe>
</template>
<script>
  import http from 'http'
  import replyBox from './reply-box'
  import { mapModules, mapRules } from 'vuet'

  export default {
    mixins: [
      mapModules({ detail: 'topic-detail', user: 'user-self' }),
      mapRules({ route: 'topic-detail' })
    ],
    computed: {
      data () {
        return this.detail.data
      }
    }
  }

</script>
<style>
  .show{
    border: 0;
  }
</style>
