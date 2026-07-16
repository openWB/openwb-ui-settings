<template>
  <div class="vehicle-soc-tesla">
    <openwb-base-number-input
      title="Fahrzeug-ID"
      required
      :min="0"
      :model-value="vehicle.configuration.tesla_ev_num"
      @update:model-value="updateConfiguration($event, 'configuration.tesla_ev_num')"
    >
      <template #help> Die ID des Fahrzeugs bei Tesla. Normalerweise "0" bei nur einem Fahrzeug im Konto. </template>
    </openwb-base-number-input>
    <openwb-base-alert
      subtype="warning"
      class="mt-2"
    >
      <p>
        Das erforderliche Token kann nicht mehr automatisiert in einem Browser abgerufen werden. Es gibt jedoch ein paar
        Wege, um an das Token zu kommen:
      </p>
      <ul>
        <li>
          <a
            href="https://tesla-info.com/tesla-token.php"
            target="_blank"
          >
            manuell über die Dev-Tools im Browser (siehe tesla-info.com)
          </a>
        </li>
        <li>
          <a
            href="https://github.com/adriankumpf/tesla_auth"
            target="_blank"
          >
            mit einem Hilfsprogramm (siehe GitHub Repo adriankumpf/tesla_auth)
          </a>
        </li>
      </ul>
      <p>
        Das <strong>Refresh Token</strong> wird verwendet, um ein Access Token zu generieren, das für die Kommunikation
        mit der Tesla API erforderlich ist.
      </p>
    </openwb-base-alert>
    <openwb-base-text-input
      title="Refresh Token"
      pattern="^(ey).*"
      required
      :model-value="vehicle.configuration.token ? vehicle.configuration.token.refresh_token : ''"
      @update:model-value="updateConfiguration($event, 'configuration.token.refresh_token')"
    />
  </div>
</template>

<script>
import ComponentStateVue from "../../mixins/ComponentState.vue";
import VehicleConfigMixin from "../VehicleConfigMixin.vue";

export default {
  name: "VehicleSocTesla",
  mixins: [ComponentStateVue, VehicleConfigMixin],
  data() {
    return {};
  },
};
</script>
