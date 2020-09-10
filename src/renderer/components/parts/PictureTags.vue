<template>
  <v-list dense class="picture-tags">
    <v-subheader>
      <div v-if="!adding">
        <span>{{tt("picture.tags")}}</span>
        <span v-if="limit">
          &nbsp;
          {{limit}}/{{tagCount}}
        </span>
        <span v-else>
          &nbsp;
          {{tagCount}}
        </span>
      </div>
      <div v-else class="tag-add">
        <v-text-field
          solo
          dense
          flat
          outlined
          autofocus
          v-model="addingTag"
          v-on:keyup.enter="addClick"
        ></v-text-field>
      </div>
      <span v-if="editable">
        <a
          class="purple--text text-decoration-none text-h6 ml-2"
          v-if="editable"
          @click="addClick"
        >+</a>
      </span>
    </v-subheader>
    <div class="tag-wrapper" v-bind:style="{'height': getHeight()}">
      <v-list-item v-for="tag in tags" :key="tag.name" class="tag-container pl-2">
        <v-list-item-content class="tag-content pa-0">
          <div>
            <a
              class="purple--text text-decoration-none"
              v-if="editable"
              @click="tagChanged(tag.name, 'remove')"
            >x</a>
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
import Picture from "../../model/pictures/Picture";
import { t } from "../../services/Localizer";

export default {
  name: "picture-tags",
  data: () => ({
    /** @type {Array<Object>} */
    tags: [],
    /** @type {Number} */
    tagCount: 0,
    /** @type {Boolean} */
    adding: false,
    /** @type {String} */
    addingTag: null,
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
    /** @type {Boolean} */
    editable: Boolean,
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
        return tag.replace(/_/g, " ");
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

      this.$emit("tagsSet", [...newTags]);

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
    tagChanged(tag, action) {
      this.$emit("tagChanged", {
        tag: tag,
        action: action,
      });

      this.calculateTags();
    },
    addClick() {
      if (this.adding && this.addingTag) {
        this.$emit("tagChanged", {
          tag: this.addingTag.replace(/\s/g, "_"),
          action: "add",
        });

        this.adding = false;
        this.addingTag = null;
        this.calculateTags();
      } else {
        this.adding = true;
      }
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

.picture-tags .tag-add .v-input {
  min-height: 20px !important;
  height: 20px !important;
}

.picture-tags .tag-add .v-input .v-input__control {
  min-height: 20px !important;
  height: 20px !important;
}

.picture-tags .tag-add .v-input .v-input__slot {
  min-height: 20px !important;
  height: 20px !important;
}

.picture-tags .tag-add .v-text-field__details {
  display: none !important;
}

.picture-tags .tag-add .v-input input {
  font-size: 13px;
}
</style>
