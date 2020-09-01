<template>
  <v-snackbar v-model="showing" :color="color" multi-line top right>
    {{ text }}
    <template v-slot:action="{ attrs }">
      <v-btn icon dark text v-bind="attrs" @click="showing = false">
        <v-icon dark>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "toaster",
  data: () => ({
    showing: false,
    color: "info",
    text: "",
  }),
  components: {},
  methods: {
    showNotification(text, color) {
      this.text = text;
      this.color = color;
      this.showing = true;
    },
    info(text) {
      this.showNotification(text, "purple");
    },
    success(text) {
      this.showNotification(text, "success");
    },
    error(text) {
      this.showNotification(text, "error");
    },
  },
};
</script>

<style>
</style>
