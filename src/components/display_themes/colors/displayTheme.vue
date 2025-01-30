<template>
  <div class="display-theme-colors">
    <openwb-base-heading>Bediensperre</openwb-base-heading>
    <openwb-base-button-group-input
      title="Bedienung sperren"
      :model-value="displayTheme.configuration.lock_changes"
      :buttons="[
        {
          buttonValue: false,
          text: 'Aus',
          class: 'btn-outline-danger',
        },
        {
          buttonValue: true,
          text: 'An',
          class: 'btn-outline-success',
        },
      ]"
      @update:model-value="updateConfiguration($event, 'configuration.lock_changes')"
    >
      <template #help>
        Die Bedienung wird automatisch nach der eingestellten Ausschaltzeit (siehe "Display Standby") wieder gesperrt.
      </template>
    </openwb-base-button-group-input>
    <openwb-base-text-input
      v-if="displayTheme.configuration.lock_changes"
      title="PIN zur Freigabe"
      subtype="password"
      required
      pattern="[0-9]{4,10}"
      :model-value="displayTheme.configuration.lock_changes_code"
      @update:model-value="updateConfiguration($event, 'configuration.lock_changes_code')"
    >
      <template #help> Der PIN muss aus 4 bis 10 Zahlen bestehen. </template>
    </openwb-base-text-input>
  </div>
</template>
<script>
import DisplayThemeConfigMixin from "../DisplayThemeConfigMixin.vue";

export default {
  name: "DisplayThemeColors",
  mixins: [DisplayThemeConfigMixin],
};
</script>
