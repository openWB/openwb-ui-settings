<template>
  <openwb-base-card
    :title="title"
    class="log-card"
    :collapsible="true"
    :collapsed="true"
    @expanded="onCardExpand"
  >
    <template #actions>
      <openwb-base-avatar
        class="bg-success clickable"
        @click.stop="loadLog(logFile, selectedVariant)"
      >
        <font-awesome-icon
          fixed-width
          :class="loading ? 'fa-spin-pulse' : ''"
          :icon="loading ? ['fas', 'spinner'] : ['fas', 'file-download']"
          title="Log laden/aktualisieren"
        />
      </openwb-base-avatar>
    </template>
    <openwb-base-alert
      v-if="foundFiles.length > 0"
      subtype="info"
    >
      Im {{ title }} stehen unterschiedliche Logauszüge zur Verfügung. Standardmässig werden Logs des letzten Durchlaufs
      geladen, für viele Fälle sollte dies ausreichen. Optional kann auch das gesamte Log geladen werden.<br />
      Wurde eine Warnung oder ein Fehler protokolliert steht zusätzlich der letzte Durchlauf mit Warnungen und Fehlern
      zur Verfügung.<br />
      <openwb-base-select-input
        v-model="selectedVariant"
        title="Logfile"
        required
        :options="foundFiles.map((file) => ({ value: file.suffix, text: file.title }))"
        @change="loadLog(logFile, selectedVariant)"
      />
    </openwb-base-alert>

    <div class="row">
      <div class="col-auto">
        <div
          v-if="!copyMessage"
          class="text-right"
        >
          <a
            href="#"
            @click.prevent="copyToClipboard(logData)"
            ><font-awesome-icon icon="clipboard" /> Log in die Zwischenablage</a
          >
        </div>
        <div
          v-else
          class="copy-message text-right"
        >
          Logs in die Zwischenablage kopiert.
        </div>
      </div>
      <div class="col-auto">
        <div
          v-if="!pastebinLink"
          class="text-right"
        >
          <a
            href="#"
            @click.prevent="postToPastebin"
            ><font-awesome-icon :icon="['fas', 'share-nodes']" /> Logs auf paste.openwb.de teilen</a
          >
        </div>
        <div
          v-else
          class="copy-message text-right"
        >
          Logs geteilt.
          <a
            :href="pastebinLink"
            target="_blank"
            >Link in die Zwischenablage kopiert.</a
          >
        </div>
      </div>
    </div>
    <pre class="log-data mb-0">{{ logData }}</pre>
  </openwb-base-card>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faClipboard as fasClipboard,
  faFileDownload as fasFileDownload,
  faSpinner as fasSpinner,
  faShareNodes as fasShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import axios from "axios";
import pako from "pako";

library.add(fasFileDownload, fasSpinner, fasClipboard, fasShareNodes);

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
      foundFiles: [], // Array to store found files with title, suffix, and description
      selectedVariant: "", // Selected file variant
      copyMessage: false, // Flag to show copy message
      pastebinLink: "", // Link to the pastebin entry
    };
  },
  methods: {
    async getFilePromise(myFile, ignore404 = false, handleError = true, useHead = false) {
      const requestMethod = useHead ? "head" : "get";
      return axios[requestMethod](location.protocol + "//" + location.host + myFile)
        .then((response) => {
          if (useHead) {
            // If the request is successful, the file exists
            return true;
          } else {
            const data = response.data;
            return data ? data : "log file is empty";
          }
        })
        .catch((error) => {
          if (!handleError) {
            throw error;
          }
          if (error.response) {
            // The request was made but the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.status == 404 && ignore404) {
              // ignore a 404 if requested, used for rotated log files which may not exist yet
              return useHead ? false : "";
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
    async loadLog(fileName, fileNameVariant = "") {
      this.logData = "wird aktualisiert...";
      this.loading = true;
      this.pastebinLink = ""; // Clear the pastebin link
      var logContents = "";
      if (fileNameVariant) {
        fileName = fileName.replace(".log", `.${fileNameVariant}.log`);
      }

      for (let i = 4; i >= 1; i--) {
        const result = await this.getFilePromise(fileName + "." + i, true);
        logContents += result;
      }

      const finalResult = await this.getFilePromise(fileName);
      logContents += finalResult;

      this.logData = logContents;
      this.loading = false;
    },
    async checkLatestLog(fileName) {
      // Define file name variations
      const fileVariations = [
        { suffix: "latest", title: "Letzten 3 Durchläufe", description: "Logs der Letzten 3 Durchläufe laden" },
        {
          suffix: "latest-warning",
          title: "Letzter Durchlauf mit Warnung oder Fehler",
          description: "Fehlerprotokoll laden",
        },
        // Add more variations as needed
      ];
      // Check for the existence of the .latest log file
      this.foundFiles = [];
      for (const variation of fileVariations) {
        const variantFileName = fileName.replace(".log", `.${variation.suffix}.log`);
        try {
          await this.getFilePromise(variantFileName, false, false, true);
          this.foundFiles.push(variation);
          if (variation.suffix === "latest") {
            this.selectedVariant = "latest";
            console.log("Found latest log file: ", variantFileName);
          }
        } catch (error) {
          console.log(error);
        }
      }
      if (this.foundFiles.length > 0) {
        this.foundFiles.push({
          suffix: "",
          title: "Vollständiges Log",
          description: "Vollständiges Log laden",
        });
      }
    },
    async onCardExpand() {
      await this.checkLatestLog(this.logFile);
      this.loadLog(this.logFile, this.selectedVariant);
    },
    copyToClipboard(text = this.logData, showMessage = true) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            if (showMessage) {
              this.showCopyMessage();
            }
          })
          .catch((err) => {
            console.error("Fehler beim Kopieren in die Zwischenablage: ", err);
          });
      } else {
        // Fallback method for older browsers and non-HTTPS contexts
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          if (showMessage) {
            this.showCopyMessage();
          }
        } catch (err) {
          console.error("Fehler beim Kopieren in die Zwischenablage: ", err);
        }
        document.body.removeChild(textArea);
      }
    },
    showCopyMessage() {
      this.copyMessage = true;
      setTimeout(() => {
        this.copyMessage = false;
      }, 3000); // Message disappears after 3 seconds
    },
    async postToPastebin() {
      try {
        // Compress the log data using gzip
        const compressedData = pako.gzip(this.logData);

        const response = await axios.post("https://bytebin.openwb.de/post", compressedData, {
          headers: {
            "Content-Type": "text/log",
            "Content-Encoding": "gzip",
          },
        });

        if (!response.data.key) {
          throw new Error("Key is missing in the response");
        }

        const pastebinKey = response.data.key;
        this.pastebinLink = `https://paste.openwb.de/${pastebinKey}`;
        console.log("Pastebin link:", this.pastebinLink);
        this.copyToClipboard(this.pastebinLink, false);
      } catch (error) {
        console.error("Fehler beim Posten auf paste.openwb.de: ", error);
      }
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
