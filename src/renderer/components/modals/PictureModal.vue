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
          <v-col cols="3" class="metadata-col">
            <div class="metadata-container" v-bind:style="{'max-height': containerHeight + 'px'}"></div>
          </v-col>
          <v-col cols="9" align-self="center" class="picturemodal-col">
            <v-row>
              <v-col cols="12" align-self="center" class="pr-6">
                <div
                  class="picturemodal-container"
                  v-bind:style="{'max-height': containerHeight + 'px', 'max-width': containerWidth + 'px'}"
                >
                  <img
                    v-if="picture"
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

export default {
  data() {
    return {
      /** @type {Boolean} */
      showing: false,
      /** @type {Picture} */
      picture: {},
      /** @type {Number} */
      containerWidth: 0,
      /** @type {Number} */
      containerHeight: 0,
      /** @type {Number} */
      imageWidth: 0,
      /** @type {Number} */
      imageHeight: 0,
      /** @type {Number} */
      currentRatio: 0,
    };
  },
  computed: {},
  methods: {
    /** @param {Picture} picture */
    show(picture) {
      this.picture = picture;
      this.calculateDimensions();

      this.showing = true;
    },
    close() {
      this.showing = false;
      this.picture = null;
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

        this.currentRatio = lowerRatio;
        this.containerWidth = maxWidth;
        this.containerHeight = maxHeight;
        this.imageWidth = scaledWidth;
        this.imageHeight = scaledHeight;

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
}

.metadata-col .metadata-container {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>