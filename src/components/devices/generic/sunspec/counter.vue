<template>
  <div class="device-generic-sunspec-counter">
    <openwb-base-heading> Einstellungen für SunSpec Zähler </openwb-base-heading>
    <openwb-base-number-input
      title="Modbus ID"
      required
      :model-value="component.configuration.modbus_id"
      :min="1"
      :max="255"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    >
      <template #help>
        Der Zähler ist bei vielen Wechselrichtern ein eigenes, über den Wechselrichter angebundenes Gerät mit einer
        eigenen Modbus-ID, nicht 1 wie der Wechselrichter selbst. Zu finden auf der Weboberfläche des Wechselrichters,
        meist unter Kommunikation -> Modbus (z. B. bei Fronius "Zähleradresse", Werkseinstellung 200).
      </template>
    </openwb-base-number-input>
  </div>
</template>

<script>
import ComponentConfigMixin from "../../ComponentConfigMixin.vue";

export default {
  name: "DeviceGenericSunspecCounter",
  mixins: [ComponentConfigMixin],
};
</script>
