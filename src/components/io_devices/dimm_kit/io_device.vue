<template>
  <div class="io-device-dimm-kit">
    <openwb-base-alert subtype="info">
      Die Ausgänge können über die folgenden Topics manuell per MQTT geschaltet werden. Falls Ausgänge in Aktionen konfiguriert werden, überschreibt das manuelle Setzen den Status.
      <ul>
      <ul>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/system/io/{{ ioDevice.id }}/set/manual/digital_output/DO1
          </openwb-base-copy-to-clipboard>
          <br />
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/system/io/{{ ioDevice.id }}/set/manual/digital_output/DO2
          </openwb-base-copy-to-clipboard>
          <br />
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/system/io/{{ ioDevice.id }}/set/manual/digital_output/DO3
          </openwb-base-copy-to-clipboard>
          <br />
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/system/io/{{ ioDevice.id }}/set/manual/digital_output/DO4
          </openwb-base-copy-to-clipboard>
          <br />
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/system/io/{{ ioDevice.id }}/set/manual/digital_output/DO5
          </openwb-base-copy-to-clipboard>
          <br />
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/system/io/{{ ioDevice.id }}/set/manual/digital_output/DO6
          </openwb-base-copy-to-clipboard>
          <br />
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/system/io/{{ ioDevice.id }}/set/manual/digital_output/DO7
          </openwb-base-copy-to-clipboard>
          <br />
        </li>
        <li>
          <openwb-base-copy-to-clipboard
            class="text-info"
            tooltip="Topic kopieren"
          >
            openWB/set/system/io/{{ ioDevice.id }}/set/manual/digital_output/DO8
          </openwb-base-copy-to-clipboard>
          <br />
        </li>
        Als Wert wird ein boolean als json oder 0/1 akzeptiert.<br />
        Beispiel:
        <span class="text-info">false</span>
      </ul>
    </openwb-base-alert>
    <openwb-base-text-input
      title="IP oder Hostname"
      subtype="host"
      required
      :model-value="ioDevice.configuration.host"
      @update:model-value="updateConfiguration($event, 'configuration.host')"
    />
    <openwb-base-number-input
      title="Port"
      required
      :model-value="ioDevice.configuration.port"
      @update:model-value="updateConfiguration($event, 'configuration.port')"
    />
    <openwb-base-number-input
      title="Modbus-ID"
      required
      :min="1"
      :max="255"
      :model-value="ioDevice.configuration.modbus_id"
      @update:model-value="updateConfiguration($event, 'configuration.modbus_id')"
    />
  </div>
</template>

<script>
import OpenwbIoDeviceConfigMixin from "../OpenwbIoDeviceConfigMixin.vue";

export default {
  name: "IoDeviceDimmKit",
  mixins: [OpenwbIoDeviceConfigMixin],
};
</script>
