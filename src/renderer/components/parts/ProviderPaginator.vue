<template>
  <div class="text-center">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :disabled="filter.page === 0 || loading"
          dark
          v-bind="attrs"
          v-on="on"
          icon
          @click="previousPage"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </template>
      <span>{{ tt("search.previous") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :disabled="searchEnd || loading"
          dark
          v-bind="attrs"
          v-on="on"
          icon
          @click="nextPage"
        >
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </template>
      <span>{{ tt("search.next") }}</span>
    </v-tooltip>
  </div>
</template>


<script>
import ProviderFilter from "../../model/ProviderFilter";
import { t } from "../../services/Localizer";

export default {
  data: () => ({}),
  props: {
    /** @type {ProviderFilter} */
    filter: Object,
    /** @type {Boolean} */
    searchEnd: Boolean,
    /** @type {Boolean} */
    loading: Boolean,
  },
  methods: {
    tt(val) {
      return t(val);
    },
    nextPage() {
      this.$emit("nextPage");
    },
    previousPage() {
      this.$emit("previousPage");
    },
  },
  created() {},
  watch: {},
};
</script>