<template>
  <v-layout row wrap class="ml-5 mr-5 pictures">
    <div v-for="picture in pictures" :key="picture.md5" class="ma-5 float-left picture-container">
      <v-tooltip absolute fixed bottom>
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
        <span>{{picture.tagString}}</span>
      </v-tooltip>
    </div>
  </v-layout>
</template>

<script>
import Picture from "../../model/picture/Picture";

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

.v-tooltip__content {
  position: fixed !important;
  top: 30px !important;
}

.picture-container .picture {
  transition: transform 0.2s;
}

.picture-container .picture:hover {
  transform: scale(1.7);
}
</style>
