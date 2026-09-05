<template>
  <div class="display-theme-url">
    <openwb-base-text-input
      title="URL"
      required
      :model-value="displayTheme.configuration.url"
      @update:model-value="updateConfiguration($event, 'configuration.url')"
    >
      <template #help>
        Diese Adresse wird vom Display-Browser ge&ouml;ffnet, zum Beispiel http://192.168.1.20/. Adressen ohne Schema
        k&ouml;nnen eingegeben werden; Normalisierung und Pr&uuml;fung erfolgen im Backend.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import DisplayThemeConfigMixin from "../DisplayThemeConfigMixin.vue";

export default {
  name: "DisplayThemeUrl",
  mixins: [DisplayThemeConfigMixin],
};
</script>
