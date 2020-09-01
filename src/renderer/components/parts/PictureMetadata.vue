<template>
  <div>
    <v-list dense class="picture-metadatas" v-bind:style="{'top': getOffset()}">
      <v-subheader>
        <span>{{tt("picture.metadatas")}}</span>
      </v-subheader>
      <div class="metadata-wrapper" v-bind:style="{'height': getHeight()}">
        <v-list-item
          v-for="metadata in metadatas"
          :key="metadata.name"
          class="metadata-container pl-2"
        >
          <v-list-item-content class="metadata-content pa-0">
            <div>
              <span class="purple--text text-decoration-none">{{tt('picture.' + metadata)}}:</span>
              <span
                class="text-decoration-none"
                v-if="!isUrl(picture[metadata])"
              >{{prettifyMetadata(metadata, picture[metadata])}}</span>
              <span class="text-decoration-none" v-else>
                <a
                  class="purple--text text-decoration-none"
                  @click="urlClicked(picture[metadata])"
                >{{tt("misc.copy")}}</a>
              </span>
            </div>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list>
    <Toaster ref="toaster"></Toaster>
  </div>
</template>

<script>
import Picture from "../../model/picture/Picture";
import { t } from "../../services/Localizer";
import Toaster from "./Toaster";
import { remote } from "electron";

export default {
  name: "picture-metadata",
  data: () => ({}),
  props: {
    /** @type {Picture} */
    picture: Object,
    /** @type {Number} */
    height: Number,
    /** @type {Number} */
    offset: Number,
    /** @type {Array<String>} */
    metadatas: Array,
  },
  components: {
    Toaster,
  },
  methods: {
    /** @param {String} val */
    tt(val) {
      return t(val);
    },
    getHeight() {
      if (this.height) {
        return this.height + "px";
      }

      return "auto";
    },
    getOffset() {
      return this.offset + "px";
    },
    prettifyMetadata(metadata, value) {
      return this.tt(value);
    },
    isUrl(value) {
      return value.toString().startsWith("http");
    },
    urlClicked(url) {
      const clipboard = remote.clipboard;
      clipboard.writeText(url);

      this.$refs.toaster.info(this.tt("misc.copied"));
    },
  },
  created() {},
  watch: {},
};
</script>

<style>
.picture-metadatas .metadata-wrapper {
  overflow-y: auto;
  width: 245px;
}

.picture-metadatas {
  position: fixed;
}

.picture-metadatas .metadata-container {
  min-height: 0 !important;
}

.picture-metadatas .metadata-content {
  font-size: 13px;
}

.picture-metadatas .metadata-content a:hover {
  color: white !important;
}

.picture-metadatas .metadata-content .metadata-content-count {
  font-size: 12px;
}
</style>
