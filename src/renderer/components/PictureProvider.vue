<template>
  <v-card
    class="rounded-0 provider-card"
    :style="{ 'min-height': initialHeight }"
  >
    <v-toolbar dark class="rounded-0 provider-toolbar">
      <ProviderNavigation></ProviderNavigation>
      <TagSelector
        ref="tagSelector"
        v-on:tagschanged="tagsChanged"
        :seenTags="tagCollection"
      ></TagSelector>
      <ProviderPaginator
        v-if="!settings.endlessScrolling"
        :filter="filter"
        :searchEnd="currentSearchFinished"
        :loading="loading"
        v-on:nextPage="paginatorNextPage"
        v-on:previousPage="paginatorPreviousPage"
      ></ProviderPaginator>
      <Refresher></Refresher>
      <ProviderSettings
        v-on:providersChanged="providersChanged"
        :providers="availableProviders"
        :selectedProviders="selectedProviders"
        v-on:ratingsChanged="ratingsChanged"
        :ratings="availableRatings"
        :selectedRatings="selectedRatings"
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
            v-on:tagsSet="tagsSet"
          ></PictureTags>
        </v-col>
        <v-col class="provider-container-pictures">
          <PictureCollection
            :pictures="pictures"
            :loading="loading"
            v-on:pictureSelected="pictureSelected"
          ></PictureCollection>
        </v-col>
      </v-row>
    </v-container>
    <Toaster ref="toaster"></Toaster>
    <PictureModal
      ref="pictureModal"
      v-on:tagSelected="tagSelected"
      v-on:favoriteChanged="favoriteChanged"
    ></PictureModal>
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
import ProviderPaginator from "./parts/ProviderPaginator";
import Picture from "../model/pictures/Picture";
import DataStore from "../services/DataStore";
import AppSettings from "../model/AppSettings";
import Refresher from "./parts/Refresher";
import { t } from "../services/Localizer";
import OnlinePictureProviderService from "../services/providerservices/OnlinePictureProviderService";
import FavoritePictureProviderService from "../services/providerservices/FavoritePictureProviderService";
import WorkspacePictureProviderService from "../services/providerservices/WorkspacePictureProviderService";
import PictureProviderService from "../services/providerservices/PictureProviderService";
import StringUtils from "../services/StringUtils";
import { app } from "electron";
import FavoritePictures from "../model/FavoritePictures";

const dataStore = new DataStore();
const providers = [
  new OnlinePictureProviderService(),
  new FavoritePictureProviderService(),
  new WorkspacePictureProviderService(),
];

export default {
  name: "picture-provider",
  data: () => ({
    /** @type {Boolean} */
    loading: false,
    /** @type {ProviderFilter} */
    filter: new ProviderFilter(),
    /** @type {AppSettings} */
    settings: {},
    /** @type {Array<Picture>} */
    pictures: [],
    /** @type {Boolean} */
    nextBatch: false,
    /** @type {Boolean} */
    previousBatch: false,
    /** @type {Boolean} */
    currentSearchFinished: false,
    /** @type {Picture} */
    currentPicture: null,
    /** @type {Array<string>} */
    currentSearchFinishedProviders: [],
    /** @type {Array<string>} */
    tagCollection: [],
    /** @type {{page: number, pictures: Array<Picture>}[]} */
    providerCache: [],
    /** @type {PictureProviderService} */
    providerService: null,
  }),
  props: {
    /** @type {String} */
    providerKey: String,
  },
  components: {
    ProviderNavigation,
    TagSelector,
    PictureCollection,
    Toaster,
    ProviderSettings,
    PictureModal,
    PictureTags,
    Refresher,
    ProviderPaginator,
  },
  methods: {
    scrollTop() {
      let container = window;
      container.scrollTo(0, 0);
    },

    /**
     *  @param {Boolean} load
     */
    resetState(load) {
      this.filter.page = 0;
      this.pictures = [];
      this.providerCache = [];
      this.currentSearchFinished = false;
      this.currentSearchFinishedProviders = [];
      this.scrollTop();

      if (load) {
        this.getPictures();
      }
    },

    paginatorNextPage() {
      this.pictures = [];
      this.scrollTop();

      this.nextBatch = true;
    },

    paginatorPreviousPage() {
      this.pictures = [];
      this.currentSearchFinished = false;
      this.scrollTop();

      this.previousBatch = true;
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

    favoriteChanged() {
      if (this.providerService.name === "favorites") {
        this.providerCache = [];
        this.pictures = [];
        this.getPictures();
      }
    },

    /**
     * @param {Object} event
     */
    tagsSet(event) {
      this.tagCollection = event.map((e) => e.name);
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
          if (this.providerService.name === "online") {
            appsettings.onlineProviders = event;
          } else {
            appsettings.workspaceProviders = event;
          }

          dataStore
            .set(AppSettings.name, appsettings)
            .then(() => {
              this.filter.providers = event;
              this.resetState(true);
            })
            .catch((err) => {
              console.log("ERR", err);
              this.$refs.toaster.info(t("search.error"));
            });
        })
        .catch((err) => {
          console.log("ERR", err);
          this.$refs.toaster.info(t("search.error"));
        });
    },
    /**
     * @param {Array<string>} event
     */
    ratingsChanged(event) {
      dataStore
        .get(AppSettings.name)
        .then((/** @type {AppSettings} */ appsettings) => {
          appsettings.ratings = event;
          dataStore
            .set(AppSettings.name, appsettings)
            .then(() => {
              this.filter.ratings = event;
              this.resetState(true);
            })
            .catch((err) => {
              console.log("ERR", err);
              this.$refs.toaster.info(t("search.error"));
            });
        })
        .catch((err) => {
          console.log("ERR", err);
          this.$refs.toaster.info(t("search.error"));
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

      if (this.previousBatch) {
        this.filter.page -= 1;
        this.previousBatch = false;
      }

      const caches = this.providerCache.filter(
        (c) => c.page === this.filter.page
      );

      if (caches && caches.length) {
        const cache = caches[0];
        console.log("cached result page", this.filter.page);
        this.pictures = [...cache.pictures];

        setTimeout(() => {
          this.loading = false;
        }, 100);

        return;
      }

      const localFilter = ProviderFilter.fromFilter(this.filter);
      if (
        this.currentSearchFinishedProviders &&
        this.currentSearchFinishedProviders.length
      ) {
        localFilter.providers = localFilter.providers.filter(
          (l) => !this.currentSearchFinishedProviders.includes(l)
        );
      }

      console.log("filter", localFilter);

      this.providerService
        .get(localFilter)
        .then((serviceResult) => {
          if (
            !serviceResult ||
            !serviceResult.pictures ||
            serviceResult.pictures.length === 0
          ) {
            this.currentSearchFinished = true;

            if (serviceResult.errors && serviceResult.errors.length) {
              serviceResult.errors.forEach((error) => {
                this.$refs.toaster.info(error);
              });
            } else {
              this.$refs.toaster.info(t("search.empty"));
            }
          } else {
            serviceResult.pictures = serviceResult.pictures.sort((p1, p2) =>
              p1.md5.localeCompare(p2.md5)
            );
            serviceResult.pictures.forEach((picture) => {
              const ratingAllowed = picture.rating
                ? localFilter.ratings.includes(picture.rating)
                : true;

              const existing = this.pictures.filter(
                (p) => p.md5 === picture.md5
              );

              const notVideo = !picture.isMedia;

              if (
                (!existing || existing.length === 0) &&
                ratingAllowed &&
                notVideo
              ) {
                this.pictures.push(picture);
              }
            });

            this.providerCache.push({
              page: this.filter.page,
              pictures: [...this.pictures],
            });

            serviceResult.finishedProviders.forEach((provider) => {
              this.currentSearchFinishedProviders.push(provider);

              this.$refs.toaster.info(
                StringUtils.format(t("search.providerempty"), {
                  provider: t(provider),
                })
              );
            });

            serviceResult.errors.forEach((error) => {
              this.$refs.toaster.info(error);
            });
          }

          setTimeout(() => {
            this.loading = false;
          }, 100);
        })
        .catch((err) => {
          console.log("ERR", err);

          this.$refs.toaster.info(t("search.error"));
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

        if (this.settings && this.settings.endlessScrolling) {
          this.nextBatch = bottomOfWindow;
        }
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
    availableProviders: function () {
      return this.providerService.providerNames;
    },
    selectedProviders: function () {
      return this.filter.providers;
    },
    availableRatings: () => {
      return ["s", "q", "e"];
    },
    selectedRatings: function () {
      return this.filter.ratings;
    },
    initialHeight: () => {
      return `${window.innerHeight * 1.1}px`;
    },
  },
  created() {
    DataStore.defaults[AppSettings.name] = AppSettings.default;

    this.providerService = providers.filter(
      (p) => p.name === this.$props.providerKey
    )[0];

    dataStore
      .get(AppSettings.name)
      .then((/** @type {AppSettings} */ appsettings) => {
        this.settings = appsettings;
        this.filter.providers =
          this.providerService.name === "online"
            ? appsettings.onlineProviders
            : appsettings.workspaceProviders;
        this.filter.ratings = appsettings.ratings;
        this.getPictures();
      })
      .catch((err) => {
        console.log("ERR", err);
        this.$refs.toaster.info(t("search.error"));
      });
  },
  mounted() {
    this.subscribeToScroll();
    this.scrollTop();
  },
  watch: {
    nextBatch(val) {
      if (val && !this.loading) {
        this.getPictures();
      }
    },
    previousBatch(val) {
      if (val && !this.loading) {
        this.getPictures();
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
