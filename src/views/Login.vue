<template>
  <div class="login">
    <form name="loginForm">
      <openwb-base-card title="Anmeldung">
        <openwb-base-text-input
          v-model="username"
          title="Benutzername"
          subtype="user"
          required
          autocomplete="username"
        />
        <openwb-base-text-input
          v-model="password"
          title="Passwort"
          subtype="password"
          required
          autocomplete="current-password"
        />
        <template #footer>
          <openwb-base-submit-buttons
            form-name="loginForm"
            :hide-reset="true"
            :hide-defaults="true"
            :save-label="'Anmelden'"
            @save="doLogin(username, password)"
          />
        </template>
      </openwb-base-card>
    </form>
  </div>
</template>

<script>
export default {
  name: "OpenwbLoginView",
  data() {
    return {
      mqttTopicsToSubscribe: [],
      username: "",
      password: "",
    };
  },
  methods: {
    doLogin(username, password) {
      console.warn("Login with:", username, "/", password);
      // set cookie
      this.$cookies.set("mqtt", `${username}:${password}`);
      // reconnect mqtt
      this.$root.reconnectMqttClient();
      this.$store.commit("storeLocal", { name: "username", value: username });
    },
  },
};
</script>
