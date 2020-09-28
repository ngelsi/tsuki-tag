<template>
  <v-dialog
    persistent
    v-model="showing"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card class="picturemodal-card rounded-0">
      <v-toolbar fixed dark>
        <v-btn :disabled="working" icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :disabled="working"
                :loading="saving"
                @click="favoritePicture(null)"
                dark
                :color="picture && picture.favorite ? 'primary' : 'white'"
                v-bind="attrs"
                v-on="on"
                icon
              >
                <v-icon>mdi-star</v-icon>
              </v-btn>
            </template>
            <span>{{
              picture && picture.favorite
                ? tt("op.unfavorite")
                : tt("op.favorite")
            }}</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :disabled="working"
                :loading="saving"
                @click="savePicture(null)"
                dark
                v-bind="attrs"
                v-on="on"
                icon
              >
                <v-icon>mdi-content-save-outline</v-icon>
              </v-btn>
            </template>
            <span>{{ tt("op.savedefault") }}</span>
          </v-tooltip>

          <v-menu>
            <template v-slot:activator="{ on: menu, attrs }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn
                    :disabled="working"
                    :loading="saving"
                    dark
                    v-bind="attrs"
                    v-on="{ ...tooltip, ...menu }"
                    icon
                  >
                    <v-icon>mdi-content-save-move-outline</v-icon>
                  </v-btn>
                </template>
                <span>{{ tt("op.saveselect") }}</span>
              </v-tooltip>
            </template>
            <v-list>
              <v-list-item-group>
                <v-list-item
                  @click="savePicture(workspace)"
                  v-for="workspace in settings.workspaces"
                  :key="workspace.name"
                >
                  <v-list-item-title>{{ workspace.name }}</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </v-toolbar-items>
      </v-toolbar>
      <v-container fluid>
        <v-row>
          <v-col cols="2" class="metadata-col">
            <div
              class="metadata-container"
              v-if="picture && picture.md5"
              v-bind:style="{ 'max-height': containerHeight + 'px' }"
            >
              <PictureTags
                :pictures="pictures"
                :showCount="false"
                :height="tagHeight"
                :editable="true"
                v-on:tagChanged="tagChanged"
                v-on:tagSelected="tagSelected"
              ></PictureTags>
            </div>
            <div
              class="metadata-container"
              v-if="picture && picture.md5"
              v-bind:style="{ 'max-height': containerHeight + 'px' }"
            >
              <PictureMetadata
                :picture="picture"
                :height="metadataHeight"
                :offset="metadataOffset"
                :metadatas="[
                  'provider',
                  'id',
                  'createdAt',
                  'dimensions',
                  'source',
                  'rating',
                  'score',
                  'extension',
                ]"
              ></PictureMetadata>
            </div>
          </v-col>
          <v-col align-self="center" class="picturemodal-col">
            <v-row>
              <v-col cols="12" align-self="center" class="pr-6">
                <div
                  class="picturemodal-container"
                  v-bind:style="{
                    'max-height': containerHeight + 'px',
                    'max-width': containerWidth + 'px',
                  }"
                >
                  <img
                    v-if="picture && picture.md5"
                    class="picture"
                    :src="imageData"
                    :height="imageHeight"
                    :width="imageWidth"
                  />
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <Toaster ref="toaster"></Toaster>
    </v-card>
  </v-dialog>
</template>

<script>
import Picture from "../../model/pictures/Picture";
import PictureTags from "../parts/PictureTags";
import PictureMetadata from "../parts/PictureMetadata";
import PictureWorker from "../../services/PictureWorker";
import { t } from "../../services/Localizer";
import { remote } from "electron";
import StringUtils from "../../services/StringUtils";
import DataStore from "../../services/DataStore";
import AppSettings from "../../model/AppSettings";
import Workspace from "../../model/Workspace";
import Toaster from "../parts/Toaster";
import path from "path";

const dataStore = new DataStore();

export default {
  data() {
    return {
      /** @type {AppSettings} */
      settings: {},
      /** @type {Boolean} */
      showing: false,
      /** @type {Boolean} */
      working: false,
      /** @type {Boolean} */
      saving: false,
      /** @type {Picture} */
      picture: {},
      /** @type {Array<Picture>}] */
      pictures: [],
      /** @type {Number} */
      containerWidth: 0,
      /** @type {Number} */
      containerHeight: 0,
      /** @type {Number} */
      imageWidth: 0,
      /** @type {Number} */
      imageHeight: 0,
      /** @type {Number} */
      tagHeight: 0,
      /** @type {Number} */
      metadataHeight: 0,
      /** @type {Number} */
      metadataOffset: 0,
      /** @type {Number} */
      currentRatio: 0,
      /** @type {String} */
      imageData: null,
      /** @type {String} */
      imagePath: null,
      /** @type {Buffer} */
      imageBuffer: null,
      /** @type {Buffer} */
      sourceImageBuffer: null,
    };
  },
  components: { PictureTags, PictureMetadata, Toaster },
  computed: {},
  methods: {
    /** @param {String} val */
    tt(val) {
      return t(val);
    },

    /** @param {Object} event */
    tagSelected(event) {
      this.$emit("tagSelected", event);
      this.close();
    },

    /** @param {Object} event */
    tagChanged(event) {
      if (event.action === "remove") {
        this.picture.removeTag("tag", event.tag);
      } else if (event.action === "add") {
        this.picture.addTag("tag", event.tag);
      }
    },

    /** @param {Picture} picture */
    show(picture) {
      this.downloadPictureData(picture);

      const newPictures = [picture];

      this.picture = picture;
      this.pictures = newPictures;

      this.calculateDimensions();
      this.getFavorite();

      this.showing = true;
    },
    close() {
      this.showing = false;
      this.picture = null;
      this.imageData = null;
      this.imagePath = null;
      this.imageBuffer = null;
      this.sourceImageBuffer = null;
      this.pictures = [];
    },
    calculateDimensions() {
      if (this.picture && this.picture.md5) {
        const maxHeight = window.outerHeight - 210;
        const maxWidth = (window.outerWidth / 12) * 9 - 26;

        const heightRatio = maxHeight / this.picture.height;
        const widthRatio = maxWidth / this.picture.width;

        const lowerRatio = heightRatio < widthRatio ? heightRatio : widthRatio;
        const scaledHeight = this.picture.height * lowerRatio;
        const scaledWidth = this.picture.width * lowerRatio;
        const metadataHeight = 150;

        this.currentRatio = lowerRatio;
        this.containerWidth = maxWidth;
        this.containerHeight = maxHeight;
        this.imageWidth = scaledWidth;
        this.imageHeight = scaledHeight;
        this.tagHeight = maxHeight - metadataHeight;
        this.metadataHeight = metadataHeight;
        this.metadataOffset = this.tagHeight + metadataHeight + 15;
      }
    },
    getFavorite() {
      const worker = new PictureWorker();
      worker.getFavorite(this.picture).then((favorite) => {
        this.picture.favorite = favorite;
      });
    },
    subscribeToResize() {
      window.onresize = (event) => {
        this.calculateDimensions();
      };
    },
    downloadPictureData(picture) {
      const worker = new PictureWorker();
      worker.downloadPicture(picture.url).then((buffer) => {
        this.imageBuffer = buffer;
        this.imageData = worker.convertToSrc(picture.extension, buffer);
      });
    },

    favoritePicture() {
      const worker = new PictureWorker();
      worker
        .favorite(this.picture)
        .then(() => {
          // this.$refs.toaster.info(
          //   this.picture.favorite ? t("op.favorited") : t("op.unfavorited")
          // );

          this.$emit("favoriteChanged");
        })
        .catch((err) => {
          console.log("ERR", err);
          this.$refs.toaster.info(t("op.favoriteerror"));
        });
    },

    /** @param {Workspace} workspace */
    savePicture(workspace) {
      if (!workspace) {
        const workspaces = this.settings.workspaces.filter((w) => w.default);
        if (!workspaces || !workspaces.length) {
          this.$refs.toaster.info(t("op.nodefaultworkspace"));
          return;
        } else {
          workspace = workspaces[0];
        }
      }

      const worker = new PictureWorker();

      this.working = true;
      this.saving = true;

      if (!workspace.downloadSourcePictures) {
        this.sourceImageBuffer = this.imageBuffer;
      }

      const error = () => {
        this.$refs.toaster.info(
          StringUtils.cformat(t("op.picturesaveerror"), workspace.name)
        );

        this.working = false;
        this.saving = false;
      };

      worker
        .downloadPicture(
          workspace.downloadSourcePictures
            ? this.picture.downloadUrl
            : this.picture.url,
          this.sourceImageBuffer
        )
        .then((buffer) => {
          this.sourceImageBuffer = buffer;

          const isjpg =
            this.picture.extension.toLowerCase() === "jpg" ||
            this.picture.extension.toLowerCase() === "jpeg";

          const dontconvert = !workspace.convertToJpg || isjpg;
          const processMetadata = isjpg || workspace.convertToJpg;

          worker
            .convertPictureToJpg(buffer, dontconvert)
            .then((buffer) => {
              worker
                .processMetadata(
                  buffer,
                  this.picture,
                  processMetadata,
                  workspace.includeTags,
                  workspace.includeMetadata
                )
                .then((buffer) => {
                  const pictureName = StringUtils.format(
                    workspace.namingConvention,
                    {
                      id: this.picture.id,
                      md5: this.picture.md5,
                      provider: this.picture.provider,
                      tagString: this.picture.tagString,
                      rating: this.picture.rating,
                      score: this.picture.score,
                      width: this.picture.width,
                      height: this.picture.height,
                      dimensions: this.picture.dimensions,
                      extension: workspace.convertToJpg
                        ? "jpg"
                        : this.picture.extension,
                    }
                  );
                  const picturePath = path.join(workspace.path, pictureName);

                  worker
                    .savePicture(picturePath, buffer)
                    .then(() => {
                      this.$refs.toaster.info(
                        StringUtils.cformat(
                          t("op.picturesaved"),
                          workspace.name,
                          pictureName
                        )
                      );

                      this.imagePath = picturePath;
                      this.working = false;
                      this.saving = false;
                    })
                    .catch((err) => {
                      console.log("ERR", err);
                      error();
                    });
                })
                .catch((err) => {
                  console.log("ERR", err);
                  error();
                });
            })
            .catch((err) => {
              console.log("ERR", err);
              error();
            });
        })
        .catch((err) => {
          console.log("ERR", err);
          error();
        });
    },
  },
  created() {
    this.subscribeToResize();

    dataStore
      .get(AppSettings.name)
      .then((data) => {
        this.settings = data;
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  },
  watch: {},
};
</script>

<style>
.v-dialog--fullscreen {
  top: 25px !important;
}

.picturemodal-card {
}

.picturemodal-container {
  text-align: center;
}

.picturemodal-container .picture {
}

.metadata-col {
  min-width: 250px;
}

.metadata-col .metadata-container {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>