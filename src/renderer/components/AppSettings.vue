<template>
  <v-card class="rounded-0 settings-card">
    <v-form ref="form" v-model="valid">
      <v-toolbar dark class="rounded-0 settings-toolbar">
        <ProviderNavigation></ProviderNavigation>&nbsp;&nbsp;
        <v-toolbar-title>{{tt("nav.settings")}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text @click="goBack">{{tt("misc.cancel")}}</v-btn>
        <v-btn text color="primary" @click="submit">{{tt("misc.save")}}</v-btn>
        <template v-slot:extension>
          <v-tabs v-model="tab" dark class="pr-5 pl-5">
            <v-tab href="#workspaces">{{tt("settings.workspaces")}}</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-container fluid class="settings-container">
        <v-tabs-items v-model="tab">
          <v-tab-item value="workspaces">
            <v-row>
              <v-col cols="12" class="pr-5 pl-5">
                <div
                  class="float-left text-h6"
                  v-if="!settings.workspaces || settings.workspaces.length === 0"
                >{{tt("settings.noworkspaces")}}</div>
                <div
                  class="float-left text-h6"
                  v-if="settings.workspaces && settings.workspaces.length"
                >{{tt("settings.workspaces")}} ({{settings.workspaces.length}})</div>
                <v-spacer></v-spacer>
                <v-btn color="primary" class="float-right" @click="addWorkspace">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-for="workspace in settings.workspaces" :key="workspace.name">
              <v-col cols="12" md="4" class="pb-0 pl-5 pr-5">
                <v-text-field
                  v-model="workspace.name"
                  required
                  :label="tt('settings.workspacename')"
                  :rules="[rules.namerequired, checkWorkspaceName]"
                  autofocus
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="8" class="pb-0 pl-5 pr-5">
                <v-text-field
                  v-model="workspace.path"
                  readonly
                  required
                  :label="tt('settings.workspacepath')"
                ></v-text-field>
              </v-col>
              <v-col cols="3" class="pt-0 pr-5 pl-5 pb-0">
                <v-switch
                  v-model="workspace.default"
                  :label="tt('settings.defaultworkspace')"
                  @click="setDefaultWorkspace(workspace)"
                ></v-switch>
              </v-col>
              <v-col cols="3" class="pt-0 pr-5 pl-5 pb-0">
                <v-switch
                  v-model="workspace.subdirectories"
                  :label="tt('settings.includesubdirectories')"
                ></v-switch>
              </v-col>
              <v-col cols="6" class="pt-0 pr-5 pl-5 pb-0">
                <v-btn
                  text
                  color="red"
                  class="float-right mt-3 mb-3"
                  @click="removeWorkspace(workspace)"
                >
                  <v-icon>mdi-close</v-icon>
                  {{tt("misc.remove")}}
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-divider></v-divider>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-form>

    <Toaster ref="toaster"></Toaster>
  </v-card>
</template>

<script>
import ProviderNavigation from "./navigation/ProviderNavigation";
import Toaster from "./parts/Toaster";
import DataStore from "../services/DataStore";
import AppSettings from "../model/AppSettings";
import { t } from "../services/Localizer";
import { remote } from "electron";
import path from "path";
import Workspace from "../model/Workspace";

const dataStore = new DataStore();

export default {
  name: "app-settings",
  data: () => ({
    /** @type {AppSettings} */
    settings: {},
    tab: null,
    valid: true,
    rules: {
      namerequired: function (val) {
        return !!val || t("settings.namerequired");
      },
    },
  }),
  components: {
    Toaster,
    ProviderNavigation,
  },
  methods: {
    /** @param {String} val */
    tt(val) {
      return t(val);
    },
    checkWorkspaceName(val) {
      if (this.settings.workspaces.filter((w) => w.name === val).length > 1) {
        return this.tt("settings.nameunique");
      }

      return true;
    },
    addWorkspace() {
      const dialog = remote.dialog;
      const mainWindow = remote.getCurrentWindow();
      const filePath = dialog.showOpenDialog(
        mainWindow,
        { properties: ["openDirectory"] },
        (/** @type {Array<String>*/ filePaths) => {
          if (filePaths && filePaths.length) {
            const selectedPath = filePaths[0];

            if (
              this.settings.workspaces.filter((w) => w.path === selectedPath)
                .length
            ) {
              this.$refs.toaster.error(this.tt("settings.pathexists"));
            } else {
              const workspace = new Workspace();
              workspace.path = selectedPath;
              workspace.name = path.basename(selectedPath);
              workspace.default =
                !this.settings.workspaces ||
                this.settings.workspaces.length === 0;
              workspace.subdirectories = true;

              this.settings.workspaces.push(workspace);
            }
          }
        }
      );
    },
    /** @param {Workspace} workspace */
    removeWorkspace(workspace) {
      this.settings.workspaces = this.settings.workspaces.filter(
        (w) => w.name !== workspace.name
      );

      if (workspace.default) {
        this.setDefaultWorkspace(null);
      }
    },
    setDefaultWorkspace(workspace) {
      setTimeout(() => {
        if (workspace && workspace.default) {
          this.settings.workspaces
            .filter((w) => w.name !== workspace.name)
            .forEach((w) => {
              w.default = false;
            });
        } else {
          if (this.settings.workspaces.length) {
            this.settings.workspaces[0].default = true;
          }
        }

        this.$forceUpdate();
      }, 100);
    },
    submit() {
      if (this.$refs.form.validate()) {
        dataStore
          .set(AppSettings.name, this.settings)
          .then(() => {
            this.$refs.toaster.info(t("settings.saved"));
            setTimeout(() => {
              this.goBack();
            }, 1000);
          })
          .catch((err) => {
            this.$refs.toaster.error(t("settings.saveerror"));
          });
      } else {
        this.$refs.toaster.error(t("settings.validationerror"));
      }
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
  },
  watch: {},
  created() {
    dataStore
      .get(AppSettings.name)
      .then((data) => {
        this.settings = data;
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  },
};
</script>

<style>
.settings-card {
  min-height: 100%;
}

.settings-card .settings-toolbar {
  position: fixed;
  width: 100%;
}

.settings-container {
  padding-top: 130px !important;
}
</style>
