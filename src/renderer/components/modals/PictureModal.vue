<template>
  <v-dialog v-model="showing" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card class="picturemodal-card rounded-0">
      <v-toolbar fixed dark>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="close">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container fluid>
        <v-row>
          <v-col cols="2" class="metadata-col">
            <div
              class="metadata-container"
              v-if="picture && picture.md5"
              v-bind:style="{'max-height': containerHeight + 'px'}"
            >
              <PictureTags
                :pictures="pictures"
                :showCount="false"
                :height="tagHeight"
                v-on:tagSelected="tagSelected"
              ></PictureTags>
            </div>
            <div
              class="metadata-container"
              v-if="picture && picture.md5"
              v-bind:style="{'max-height': containerHeight + 'px'}"
            >
              <PictureMetadata
                :picture="picture"
                :height="metadataHeight"
                :offset="metadataOffset"
                :metadatas="['provider', 'id', 'createdAt', 'dimensions', 'source', 'rating', 'score', 'extension']"
              ></PictureMetadata>
            </div>
          </v-col>
          <v-col align-self="center" class="picturemodal-col">
            <v-row>
              <v-col cols="12" align-self="center" class="pr-6">
                <div
                  class="picturemodal-container"
                  v-bind:style="{'max-height': containerHeight + 'px', 'max-width': containerWidth + 'px'}"
                >
                  <img
                    v-if="picture && picture.md5"
                    class="picture"
                    :src="picture.url"
                    :height="imageHeight"
                    :width="imageWidth"
                  />
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import Picture from "../../model/picture/Picture";
import PictureTags from "../parts/PictureTags";
import PictureMetadata from "../parts/PictureMetadata";

export default {
  data() {
    return {
      /** @type {Boolean} */
      showing: false,
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
    };
  },
  components: { PictureTags, PictureMetadata },
  computed: {},
  methods: {
    /** @param {Object} event */
    tagSelected(event) {
      this.$emit("tagSelected", event);
      this.close();
    },

    /** @param {Picture} picture */
    show(picture) {
      const newPictures = [picture];

      this.picture = picture;
      this.pictures = newPictures;

      this.calculateDimensions();

      this.showing = true;
    },
    close() {
      this.showing = false;
      this.picture = null;
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

        console.log(scaledWidth, scaledHeight);
      }
    },
    subscribeToResize() {
      window.onresize = (event) => {
        this.calculateDimensions();
      };
    },
  },
  created() {
    this.subscribeToResize();
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