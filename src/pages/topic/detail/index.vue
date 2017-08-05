<template>
  <iframe class="show" v-bind:src="data" width="100%" height="100%"></iframe>
</template>
<script>
  import { mapModules, mapRules } from 'vuet'
  let Base64 = require('js-base64').Base64

  export default {
    mixins: [
      mapModules({ detail: 'topic-detail' }),
      mapRules({ route: 'topic-detail' })
    ],
    computed: {
      data () {
        return Base64.decode(this.detail.data.id)
      }
    }
  }

</script>
<style>
  .show{
    border: 0;
  }
</style>
