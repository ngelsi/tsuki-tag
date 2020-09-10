<template>
  <v-autocomplete
    v-model="tags"
    :value="tags"
    :loading="loading"
    :items="items"
    :search-input.sync="search"
    class="mx-4 rounded-0"
    hide-no-data
    hide-details
    clearable
    auto-select-first
    :label="tt('search.tags')"
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
import { t } from "../../services/Localizer";

export default {
  name: "tag-selector",
  data: () => ({
    search: null,
    items: [],
    loading: false,
    tags: [],
  }),
  props: {
    /** @type {Array<string>} */
    seenTags: Array,
  },
  components: {},
  methods: {
    querySelections(v) {
      this.loading = true;
      setTimeout(() => {
        this.items = this.tags.filter((e) => {
          return (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1;
        });

        this.items.push(v);

        if (this.seenTags && this.seenTags.length) {
          this.seenTags
            .filter((t) => t.indexOf(v) > -1)
            .forEach((t) => {
              this.items.push(t);
            });
        }

        this.tags.forEach((tag) => {
          this.items.push(tag);
        });

        this.loading = false;
      }, 200);
    },
    addTag(tag) {
      this.tags.push(tag);
      this.items.push(tag);
    },
    removeTag(tag) {
      this.tags = this.tags.filter((t) => t !== tag);
    },
    uniqueTag(tag) {
      this.tags = [];
      this.tags.push(tag);
      this.items.push(tag);
    },
    tt(val) {
      return t(val);
    },
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
    tags(val) {
      this.search = null;
      this.$emit("tagschanged", this.tags);
    },
    seenTags(val) {
      this.seenTags = val;
    },
  },
};
</script>

<style>
</style>
