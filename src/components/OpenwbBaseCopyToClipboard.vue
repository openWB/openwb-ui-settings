<template>
  <span
    :title="copySupported && !isCopied ? tooltip : ''"
    :class="{ 'copy-me': copySupported && !isCopied }"
    @click.stop="click"
  >
    <span ref="content">
      <slot />
    </span>
    <font-awesome-icon
      v-if="copySupported"
      class="ml-1"
      :icon="isCopied ? ['fas', 'clipboard-check'] : ['fas', 'clipboard']"
    />
  </span>
</template>

<script>
import { useClipboard } from "@vueuse/core";
const { text, copy, copied, isSupported } = useClipboard({ copiedDuring: 3000, legacy: true });

import { library } from "@fortawesome/fontawesome-svg-core";
import { faClipboard as fasClipboard, faClipboardCheck as fasClipboardCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasClipboard, fasClipboardCheck);

export default {
  name: "OpenwbCopyToClipboard",
  components: {
    FontAwesomeIcon,
  },
  props: {
    tooltip: { type: String, default: "Wert kopieren" },
  },
  data() {
    return {};
  },
  computed: {
    contentText() {
      return this.$refs["content"] ? this.$refs["content"].innerText.trim() : "";
    },
    isCopied() {
      return copied.value && text.value === this.contentText;
    },
    copySupported() {
      return isSupported.value;
    },
  },
  methods: {
    click() {
      if (this.copySupported) {
        copy(this.contentText)
          .then(() => {
            console.debug("Text copied to clipboard:", text.value);
          })
          .catch((error) => {
            console.error("Failed to copy text to clipboard:", error);
          });
      }
    },
  },
};
</script>

<style scoped>
span.copy-me {
  cursor: copy;
}
</style>
