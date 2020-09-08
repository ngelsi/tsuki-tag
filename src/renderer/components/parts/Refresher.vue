<template>
  <div class="text-center">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn dark v-bind="attrs" v-on="on" icon @click="refresh">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </template>
      <span>{{tt("misc.refresh")}}</span>
    </v-tooltip>
  </div>
</template>


<script>
import { t } from "../../services/Localizer";

export default {
  data: () => ({}),
  props: {},
  methods: {
    tt(val) {
      return t(val);
    },
    refresh() {
      window.location.reload();
    },
  },
  created() {},
  watch: {},
};
</script>