<template>
  <div class="display-theme-url">
    <openwb-base-text-input
      title="URL"
      required
      subtype="url"
      :model-value="displayTheme.configuration.url"
      @update:model-value="updateConfiguration($event, 'configuration.url')"
    >
      <template #help>
        Diese Adresse im Display dargestellt. Das Ziel
        muss sich im lokalen Netzwerk oder dem privaten (RFC1918) Addressraum befinden. Andere Ziele werden
        nicht akzeptiert.
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
