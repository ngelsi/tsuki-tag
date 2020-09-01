<template>
  <v-list dense class="picture-tags">
    <v-subheader>
      <span>{{tt("picture.tags")}}</span>
      <span v-if="limit">
        &nbsp;
        {{limit}}/{{tagCount}}
      </span>
      <span v-else>
        &nbsp;
        {{tagCount}}
      </span>
    </v-subheader>
    <div class="tag-wrapper" v-bind:style="{'height': getHeight()}">
      <v-list-item v-for="tag in tags" :key="tag.name" class="tag-container pl-2">
        <v-list-item-content class="tag-content pa-0">
          <div>
            <a class="purple--text text-decoration-none" @click="tagSelected(tag.name, 'add')">+</a>
            <a class="purple--text text-decoration-none" @click="tagSelected(tag.name, 'remove')">-</a>
            <a
              class="purple--text text-decoration-none"
              @click="tagSelected(tag.name, 'unique')"
            >{{prettifyTag(tag.name)}}</a>
            <span class="tag-content-count" v-if="showCount">{{tag.count}}</span>
          </div>
        </v-list-item-content>
      </v-list-item>
    </div>
  </v-list>
</template>

<script>
import Picture from "../../model/picture/Picture";
import { t } from "../../services/Localizer";

export default {
  name: "picture-tags",
  data: () => ({
    /** @type {Array<Object>} */
    tags: [],
    /** @type {Number} */
    tagCount: 0,
  }),
  props: {
    /** @type {Array<Picture>} */
    pictures: Array,
    /** @type {Number} */
    limit: Number,
    /** @type {Boolean} */
    showCount: Boolean,
    /** @type {Number} */
    height: Number,
  },
  components: {},
  methods: {
    /** @param {String} val */
    tt(val) {
      return t(val);
    },
    /** @param {String} tag */
    prettifyTag(tag) {
      if (tag) {
        return tag.replace("_", " ");
      }
    },
    getHeight() {
      if (this.height) {
        return this.height + "px";
      }

      return "auto";
    },
    calculateTags() {
      let newTags = [];

      this.pictures.forEach(
        /** @type {Picture} */ (picture) => {
          picture.tags.forEach((tag) => {
            const existingTag = newTags.filter((t) => t.name === tag);
            if (existingTag && existingTag.length == 1) {
              existingTag[0].count += 1;
            } else {
              const newTag = {
                name: tag,
                count: 1,
              };

              newTags.push(newTag);
            }
          });
        }
      );

      newTags = newTags.sort((t1, t2) => t1.count - t2.count).reverse();
      this.tagCount = newTags.length;

      if (this.limit) {
        newTags = newTags.slice(0, this.limit);
      }

      newTags = newTags.sort((t1, t2) => t1.name.localeCompare(t2.name));
      this.tags = newTags;
    },
    tagSelected(tag, action) {
      this.$emit("tagSelected", {
        tag: tag,
        action: action,
      });
    },
  },
  created() {
    this.calculateTags();
  },
  watch: {
    pictures(val) {
      this.calculateTags();
    },
  },
};
</script>

<style>
.picture-tags .tag-wrapper {
  overflow-y: auto;
  width: 245px;
}

.picture-tags {
  position: fixed;
}

.picture-tags .tag-container {
  min-height: 0 !important;
}

.picture-tags .tag-content {
  font-size: 13px;
}

.picture-tags .tag-content a:hover {
  color: white !important;
}

.picture-tags .tag-content .tag-content-count {
  font-size: 12px;
}
</style>
