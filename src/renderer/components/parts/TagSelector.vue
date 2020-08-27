<template>
  <v-autocomplete
    v-model="tags"
    :loading="loading"
    :items="items"
    :search-input.sync="search"
    class="mx-4 rounded-0"
    hide-no-data
    hide-details
    clearable
    auto-select-first
    label="Search tags"
    solo
    dark
    full-width
    autofocus
    chips
    multiple
  ></v-autocomplete>
</template>

<script>
import ProviderFilter from "../../model/ProviderFilter";

export default {
  name: "tag-selector",
  data: () => ({
    search: null,
    items: [],
    loading: false,
    tags: [],
  }),
  props: {},
  components: {},
  methods: {
    querySelections(v) {
      this.loading = true;
      setTimeout(() => {
        this.items = this.tags.filter((e) => {
          return (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1;
        });

        if (!this.items.length) {
          this.items.push(v);
        }

        this.tags.forEach((tag) => {
          this.items.push(tag);
        });

        this.loading = false;
      }, 200);
    },
    addTag(tag) {
      this.tags.push(tag);
    },
    removeTag(tag) {
      this.tags = this.tags.filter((t) => t !== tag);
    },
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
    tags(val) {
      this.search = null;
      console.log("tagschanged");
      this.$emit("tagschanged", this.tags);
    },
  },
};
</script>

<style>
</style>
