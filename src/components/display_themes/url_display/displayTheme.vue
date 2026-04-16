<template>
  <div class="display-theme-url-display">
    <openwb-base-heading>Einstellungen fuer URL Display</openwb-base-heading>
    <openwb-base-text-input
      title="URL"
      subtype="url"
      required
      :model-value="displayTheme.configuration.url"
      @update:model-value="updateConfiguration($event, 'configuration.url')"
    >
      <template #help>
        Es wird eine vollstaendige URL inklusive Protokoll erwartet, die im Display Theme angezeigt werden soll.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import DisplayThemeConfigMixin from "../DisplayThemeConfigMixin.vue";

export default {
  name: "DisplayThemeUrlDisplay",
  mixins: [DisplayThemeConfigMixin],
};
</script>
