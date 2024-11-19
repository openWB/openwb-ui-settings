<template>
  <div class="device-lg">
    <openwb-base-heading> Einstellungen für LG ESS V1.0 </openwb-base-heading>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="device.configuration.ip_address"
      @update:model-value="updateConfiguration($event, 'configuration.ip_address')"
    />
    <openwb-base-text-input
      title="Passwort"
      subtype="password"
      required
      :model-value="device.configuration.password"
      @update:model-value="updateConfiguration($event, 'configuration.password')"
    >
      <template #help>
        Passwort, um sich in den LG ESS V1.0 einzuloggen. Das Passwort ist standardmäßig die Registrierungsnummer, die
        sich auf einem Aufkleber auf dem PCS (dem Hybridwechselrichter und Batteriemanagementsystem) befindet.
        Alternativ findet man die Registrierungsnummer in der App unter dem Menüpunkt "Systeminformationen". Mit der
        Registrierungsnummer kann man sich dann in der Rolle "installer" einloggen.
      </template>
    </openwb-base-text-input>
  </div>
</template>

<script>
import DeviceConfigMixin from "../../DeviceConfigMixin.vue";

export default {
  name: "DeviceLG",
  mixins: [DeviceConfigMixin],
};
</script>
