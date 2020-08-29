<template>
  <v-card class="rounded-0 provider-card" :style="{'min-height': initialHeight}">
    <v-toolbar dark class="rounded-0 provider-toolbar">
      <ProviderNavigation></ProviderNavigation>
      <TagSelector ref="tagSelector" v-on:tagschanged="tagsChanged"></TagSelector>
      <ProviderSettings
        v-on:providersChanged="providersChanged"
        :providers="availableProviders"
        :selectedProviders="availableProviders"
      ></ProviderSettings>
    </v-toolbar>
    <PictureCollection :pictures="pictures"></PictureCollection>
    <Toaster ref="toaster"></Toaster>
  </v-card>
</template>

<script>
import ProviderNavigation from "./navigation/ProviderNavigation";
import TagSelector from "./parts/TagSelector";
import Toaster from "./parts/Toaster";
import ProviderSettings from "./parts/ProviderSettings";
import PictureCollection from "./parts/PictureCollection";
import ProviderFilter from "../model/ProviderFilter";
import Picture from "../model/picture/Picture";
import { t } from "../services/Localizer";
import { OnlinePictureProviderService } from "../services/PictureProviderService";

const providerService = new OnlinePictureProviderService();

export default {
  name: "online-provider",
  data: () => ({
    /** @type {Boolean} */
    loading: false,
    /** @type {ProviderFilter} */
    filter: new ProviderFilter(),
    /** @type {Array<Picture>} */
    pictures: [],
    /** @type {Boolean} */
    nextBatch: false,
    /** @type {Boolean} */
    currentSearchFinished: false,
  }),
  components: {
    ProviderNavigation,
    TagSelector,
    PictureCollection,
    Toaster,
    ProviderSettings,
  },
  methods: {
    /**
     *  @param {Boolean} load
     */
    resetState(load) {
      this.filter.page = 0;
      this.pictures = [];
      this.currentSearchFinished = false;

      let container = window;
      container.scrollTo(0, 0);

      if (load) {
        this.getPictures();
      }
    },

    /**
     * @param {Array<string>} event
     */
    tagsChanged(event) {
      this.filter.tags = event;
      this.resetState(true);
    },
    /**
     * @param {Array<string>} event
     */
    providersChanged(event) {
      this.filter.providers = event;
      this.resetState(true);
    },
    getPictures() {
      if (this.loading || this.currentSearchFinished) {
        return;
      }

      this.loading = true;

      if (this.nextBatch) {
        this.filter.page += 1;
        this.nextBatch = false;
      }

      providerService
        .get(this.filter)
        .then((data) => {
          if (!data || data.length === 0) {
            this.currentSearchFinished = true;
          } else {
            data = data.sort((p1, p2) => p1.md5.localeCompare(p2.md5));
            data.forEach((picture) => {
              const existing = this.pictures.filter(
                (p) => p.md5 === picture.md5
              );
              if (!existing || existing.length === 0) {
                this.pictures.push(picture);
              }
            });
          }

          setTimeout(() => {
            this.loading = false;
          }, 500);
        })
        .catch((err) => {
          console.log("ERROR", err);
          this.loading = false;
        });
    },
    subscribeToScroll() {
      let container = window;
      container.onscroll = () => {
        let container = document.documentElement;
        let bottomOfWindow =
          container.scrollTop + container.clientHeight + 1 >=
          container.scrollHeight;

        this.nextBatch = bottomOfWindow;
      };
    },
    addTag(tag) {
      this.$refs.tagSelector.addTag(tag);
    },
    removeTag(tag) {
      this.$refs.tagSelector.removeTag(tag);
    },
  },
  computed: {
    availableProviders: () => {
      return providerService.providerNames;
    },
    initialHeight: () => {
      return `${window.innerHeight * 1.1}px`;
    },
  },
  created() {
    this.filter.providers = providerService.providerNames;
    this.getPictures();
  },
  mounted() {
    this.subscribeToScroll();
  },
  watch: {
    nextBatch(val) {
      if (val && !this.loading) {
        this.getPictures();
      }
    },
    currentSearchFinished(val) {
      if (val) {
        this.$refs.toaster.info(t("search.empty"));
        console.log("current search finished");
      }
    },
  },
};
</script>

<style>
.provider-card {
  min-height: 100%;
}

.provider-card .provider-toolbar {
  position: fixed;
  width: 100%;
}
</style>
