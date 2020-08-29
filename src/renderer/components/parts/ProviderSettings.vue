<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title>{{tt("search.providers")}}</v-card-title>

        <v-divider></v-divider>

        <v-list>
          <v-list-item v-for="provider in providerSelections" :key="provider.name">
            <v-list-item-action>
              <v-switch v-on:change="providersChanged" v-model="provider.selected" color="purple"></v-switch>
            </v-list-item-action>
            <v-list-item-title>{{tt(provider.name)}}</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="menu = false">{{tt("misc.close")}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>


<script>
import { t } from "../../services/Localizer";

export default {
  data: () => ({
    /** @type {Array<Object>} */
    providerSelections: [],
    /** @type {Boolean} */
    menu: false,
  }),
  props: {
    /** @type {Array<String>} */
    providers: Array,
    /** @type {Array<String>} */
    selectedProviders: Array,
  },
  methods: {
    tt(val) {
      return t(val);
    },
    providersChanged() {
      this.$emit(
        "providersChanged",
        this.providerSelections.filter((s) => s.selected).map((s) => s.name)
      );
    },
  },
  created() {
    this.providerSelections = [];
    this.providers.forEach((provider) => {
      const selected = this.selectedProviders.filter((p) => p === provider);
      this.providerSelections.push({
        name: provider,
        selected: selected && selected.length >= 1,
      });
    });
  },
};
</script>