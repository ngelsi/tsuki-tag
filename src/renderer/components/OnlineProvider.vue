<template>
  <v-card class="rounded-0 provider-card" :style="{'min-height': initialHeight}">
    <v-toolbar dark class="rounded-0 provider-toolbar">
      <ProviderNavigation></ProviderNavigation>
      <TagSelector ref="tagSelector" v-on:tagschanged="tagsChanged"></TagSelector>
      <ProviderSettings
        v-on:providersChanged="providersChanged"
        :providers="availableProviders"
        :selectedProviders="selectedProviders"
      ></ProviderSettings>
    </v-toolbar>
    <v-container fluid class="provider-container">
      <v-row>
        <v-col cols="2" class="provider-container-tags">
          <PictureTags
            :pictures="pictures"
            :limit="40"
            :showCount="true"
            v-on:tagSelected="tagSelected"
          ></PictureTags>
        </v-col>
        <v-col class="provider-container-pictures">
          <PictureCollection :pictures="pictures" v-on:pictureSelected="pictureSelected"></PictureCollection>
        </v-col>
      </v-row>
    </v-container>
    <Toaster ref="toaster"></Toaster>
    <PictureModal ref="pictureModal" v-on:tagSelected="tagSelected"></PictureModal>
  </v-card>
</template>

<script>
import ProviderNavigation from "./navigation/ProviderNavigation";
import TagSelector from "./parts/TagSelector";
import Toaster from "./parts/Toaster";
import ProviderSettings from "./parts/ProviderSettings";
import PictureCollection from "./parts/PictureCollection";
import PictureModal from "./modals/PictureModal";
import PictureTags from "./parts/PictureTags";
import ProviderFilter from "../model/ProviderFilter";
import Picture from "../model/pictures/Picture";
import DataStore from "../services/DataStore";
import AppSettings from "../model/AppSettings";
import { t } from "../services/Localizer";
import { OnlinePictureProviderService } from "../services/PictureProviderService";

const providerService = new OnlinePictureProviderService();
const dataStore = new DataStore();

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
    /** @type {Picture} */
    currentPicture: null,
  }),
  components: {
    ProviderNavigation,
    TagSelector,
    PictureCollection,
    Toaster,
    ProviderSettings,
    PictureModal,
    PictureTags,
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
     * @param {Picture} event
     */
    pictureSelected(event) {
      this.currentPicture = event;
      this.$refs.pictureModal.show(this.currentPicture);
    },

    /**
     * @param {Object} event
     */
    tagSelected(event) {
      if (event.action === "add") {
        const existingTag = this.filter.tags.filter((t) => t == event.tag);
        if (existingTag && existingTag.length) {
          return;
        } else {
          this.$refs.tagSelector.addTag(event.tag);
        }
      } else if (event.action === "remove") {
        const existingTag = this.filter.tags.filter((t) => t == event.tag);
        if (existingTag && existingTag.length) {
          this.$refs.tagSelector.removeTag(event.tag);
        }
      } else if (event.action === "unique") {
        this.$refs.tagSelector.uniqueTag(event.tag);
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
      dataStore
        .get(AppSettings.name)
        .then((/** @type {AppSettings} */ appsettings) => {
          appsettings.onlineProviders = event;
          dataStore
            .set(AppSettings.name, appsettings)
            .then(() => {
              this.filter.providers = event;
              this.resetState(true);
            })
            .catch((err) => {
              console.log("ERR", err);
            });
        })
        .catch((err) => {
          console.log("ERR", err);
        });
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
    selectedProviders: function () {
      return this.filter.providers;
    },
    initialHeight: () => {
      return `${window.innerHeight * 1.1}px`;
    },
  },
  created() {
    DataStore.defaults[AppSettings.name] = AppSettings.default;

    dataStore
      .get(AppSettings.name)
      .then((/** @type {AppSettings} */ appsettings) => {
        this.filter.providers = appsettings.onlineProviders;
        this.getPictures();
      })
      .catch((err) => {
        console.log("ERR", err);
      });
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

.provider-container {
  padding-top: 75px !important;
}

.provider-container-tags {
  min-width: 250px;
}
</style>
