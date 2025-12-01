<template>
  <div class="logout">
    <openwb-base-alert subtype="info">
      Du wurdest abgemeldet.
      <router-link to="/Login"> Neu Anmelden. </router-link>
    </openwb-base-alert>
  </div>
</template>

<script>
export default {
  name: "OpenwbLogoutView",
  data() {
    return {
      mqttTopicsToSubscribe: [],
    };
  },
  mounted() {
    // unset cookie
    console.warn("Logging out...");
    this.$cookies.remove("mqtt");
    // reconnect mqtt
    this.$root.reconnectMqttClient();
    this.$store.commit("storeLocal", { name: "username", value: null });
  },
};
</script>
