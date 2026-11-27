<template>
  <div class="display-theme-url">
    <openwb-base-text-input
      title="URL"
      required
      subtype="text"
      :model-value="displayTheme.configuration.url"
      @update:model-value="updateConfiguration($event, 'configuration.url')"
    >
      <template #help>
        Diese Adresse wird vom Display-Browser geöffnet, zum Beispiel die Oberfläche von evcc: http://192.168.1.20:7070.
        Das Ziel muss sich im lokalen Netzwerk oder im privaten Adressraum (RFC1918) befinden, öffentliche Ziele werden
        nicht akzeptiert. Wird ein Name nicht akzeptiert oder nicht aufgelöst, bitte die IP-Adresse verwenden. Es
        sollten nur vertrauenswürdige Seiten eingebunden werden.
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
