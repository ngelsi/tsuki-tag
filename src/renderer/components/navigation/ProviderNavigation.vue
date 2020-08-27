<template>
  <div>
    <v-menu v-model="menuShowing" :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }">
        <v-icon dark v-bind="attrs" v-on="on">mdi-dots-vertical</v-icon>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-title>Browse online</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "provider-navigation",
  data: () => ({
    menuShowing: false,
  }),
  components: {},
};
</script>

<style>
</style>
