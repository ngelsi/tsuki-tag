<template>
  <div id="app">
    <div class="op-bar-protecter op-bar"></div>
    <div class="app-container">
      <v-app>
        <v-system-bar app class="op-bar">
          <span>Tsuki-tag</span>
          <v-spacer></v-spacer>
          <v-icon @click="minimize" class="op-icon">mdi-minus</v-icon>
          <v-icon @click="maximize" class="op-icon">mdi-checkbox-blank-outline</v-icon>
          <v-icon @click="close" class="op-icon">mdi-close</v-icon>
        </v-system-bar>
        <v-main>
          <v-container fluid class="pa-0 main-container">
            <router-view></router-view>
          </v-container>
        </v-main>
      </v-app>
    </div>
  </div>
</template>

<script>
const remote = require("electron").remote;

export default {
  name: "tsuki-tag",
  data: () => ({
    w: remote.getCurrentWindow(),
  }),
  methods: {
    close() {
      this.w.close();
    },
    minimize() {
      this.w.minimize();
    },
    maximize() {
      this.w.maximize();
    },
  },
};
</script>

<style>
html {
}

.app-container {
}

.main-container {
}

.op-bar-protecter {
  height: 30px;
  position: absolute;
  top: 0;
  width: 95%;
}

.op-bar {
  -webkit-app-region: drag;
}

.op-bar .op-icon {
  -webkit-app-region: no-drag;
}

::-webkit-scrollbar {
  width: 5px;
  background: black;
}

::-webkit-scrollbar-thumb {
  background: #272727;
}
</style>
