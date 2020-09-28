<template>
  <div>
    <v-menu v-model="menuShowing" :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn icon v-bind="attrs" v-on="{ ...tooltip, ...on }">
              <v-icon>mdi-swap-horizontal-bold</v-icon>
            </v-btn>
          </template>
          <span>{{ tt("nav.nav") }}</span>
        </v-tooltip>
      </template>
      <v-list>
        <v-list-item-group>
          <v-list-item @click="route('/online')">
            <v-list-item-title>{{
              tt("nav.onlineproviders")
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="route('/favorites')">
            <v-list-item-title>{{ tt("nav.favorites") }}</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="route('appsettings')">
            <v-list-item-title>{{ tt("nav.settings") }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { t } from "../../services/Localizer";

export default {
  name: "provider-navigation",
  data: () => ({
    menuShowing: false,
  }),
  components: {},
  methods: {
    /** @param {String} val */
    tt(val) {
      return t(val);
    },
    /** @param {String} path */
    route(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style>
</style>
