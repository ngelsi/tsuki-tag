<template>
  <v-layout row wrap class="ml-5 mr-5 pictures">
    <div v-for="picture in pictures" :key="picture.md5" class="ma-5 float-left picture-container">
      <v-tooltip absolute fixed bottom content-class="picture-metadata-tooltip">
        <template v-slot:activator="{ on, attrs }">
          <img
            :src="picture.previewUrl"
            v-bind="attrs"
            v-on="on"
            class="picture"
            :width="picture.previewWidth"
            :height="picture.previewHeight"
            @click="pictureSelected(picture)"
          />
        </template>
        <div class="picture-tooltip-container">
          <div class="tooltip-tags">
            <v-list dense>
              <v-subheader>{{tt("picture.tags")}}</v-subheader>
              <v-list-item v-for="(tag, index) in picture.tags" :key="index">
                <span class="purple--text">{{tag}}</span>
              </v-list-item>
            </v-list>
          </div>
          <div class="tooltip-metadata">
            <v-list dense>
              <v-subheader>{{tt("picture.metadatas")}}</v-subheader>
              <v-list-item
                v-for="(metadata, index) in ['provider', 'id', 'dimensions', 'rating', 'score', 'extension']"
                :key="index"
              >
                <span class="purple--text">{{tt('picture.' + metadata)}}:</span>
                &nbsp;
                <span>{{tt(picture[metadata])}}</span>
              </v-list-item>
            </v-list>
          </div>
        </div>
      </v-tooltip>
    </div>
  </v-layout>
</template>

<script>
import Picture from "../../model/pictures/Picture";
import { t } from "../../services/Localizer";

export default {
  name: "picture-collection",
  data: () => ({}),
  props: {
    /** @type {Array<Picture>} */
    pictures: Array,
  },
  components: {},
  methods: {
    /** @param {Picture} picture */
    pictureSelected(picture) {
      this.$emit("pictureSelected", picture);
    },
    /** @param {String} val */
    tt(val) {
      return t(val);
    },
  },
  watch: {},
};
</script>

<style>
.pictures {
}

.picture-container {
  cursor: pointer;
}

.picture-metadata-tooltip.v-tooltip__content {
  position: fixed !important;
  top: 24px !important;
  left: 0px !important;
  height: 95%;
  padding: 0;
  min-width: 245px;
  background-color: #1e1e1e !important;
}

.picture-metadata-tooltip .v-list--dense .v-list-item,
.v-list-item--dense {
  height: 15px !important;
  min-height: 15px !important;
}

.picture-container .picture {
  transition: transform 0.2s;
}

.picture-container .picture:hover {
  transform: scale(1.7);
}

.picture-tooltip-container {
}

.picture-tooltip-container .tooltip-metadata {
  height: 150px;
}

.picture-tooltip-container .tooltip-tags {
  height: calc(100vh - 180px);
  overflow: hidden;
}

.picture-tooltip-container .tooltip-tags .v-list {
  height: 100% !important;
}
</style>
