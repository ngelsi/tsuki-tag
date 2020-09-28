<template>
  <PictureProvider :providerKey="provider"></PictureProvider>
</template>

<script>
import PictureProvider from "./PictureProvider";

export default {
  name: "home",
  data: () => ({}),
  props: {
    /** @type {String} */
    provider: String,
  },
  components: {
    PictureProvider,
  },
  methods: {},
  watch: {},
};
</script>

<style>
</style>
