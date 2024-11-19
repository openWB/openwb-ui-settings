<template>
  <openwb-base-card
    :title="title"
    class="log-card mt-3"
    :collapsible="true"
    :collapsed="true"
  >
    <template #actions>
      <openwb-base-avatar
        class="bg-success clickable"
        @click.stop="loadLog(logFile)"
      >
        <font-awesome-icon
          fixed-width
          :class="loading ? 'fa-spin-pulse' : ''"
          :icon="loading ? ['fas', 'spinner'] : ['fas', 'file-download']"
        />
      </openwb-base-avatar>
    </template>
    <pre class="log-data mb-0">{{ logData }}</pre>
  </openwb-base-card>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFileDownload as fasFileDownload, faSpinner as fasSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasFileDownload, fasSpinner);

export default {
  name: "OpenwbLogCard",
  components: {
    FontAwesomeIcon,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    logFile: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      logData: "-- noch nicht geladen --",
      loading: false,
    };
  },
  methods: {
    async getFilePromise(myFile, ignore404 = false) {
      return this.axios
        .get(location.protocol + "//" + location.host + myFile)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.status == 404 && ignore404) {
              // ignore a 404 if requested, used for rotated log files which may not exist yet
              return "";
            }
            return (
              "A 404 is expected if running node.js dev server!\n" +
              error.response.status +
              " " +
              error.response.statusText +
              ": " +
              error.response.request.responseURL
            );
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            return error.request;
          } else {
            // Something happened in setting up the request that triggered an Error
            return error.message;
          }
        });
    },
    async loadLog(fileName) {
      this.logData = "wird aktualisiert...";
      this.loading = true;
      var logContents = "";

      for (let i = 4; i >= 1; i--) {
        const result = await this.getFilePromise(fileName + "." + i, true);
        logContents += result;
      }

      const finalResult = await this.getFilePromise(fileName);
      logContents += finalResult;

      this.logData = logContents;
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.log-data {
  max-height: 70vh;
  overflow-y: scroll;
}
</style>
