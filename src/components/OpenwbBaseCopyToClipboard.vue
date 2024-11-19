<template>
  <span
    ref="slot-wrapper"
    :title="tooltip"
    class="copy-me"
    @click="click"
  >
    <slot />
    <font-awesome-icon
      fixed-width
      :icon="isCopied ? ['fas', 'clipboard-check'] : ['fas', 'clipboard']"
    />
  </span>
</template>

<script>
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
    return {
      clipboardApiAvailable: navigator.clipboard != undefined,
      isCopied: false,
    };
  },
  methods: {
    click() {
      // event.target may be our icon, so we use a ref here
      console.debug(this.$refs["slot-wrapper"].innerText);
      if (this.clipboardApiAvailable) {
        navigator.clipboard.writeText(this.$refs["slot-wrapper"].innerText).then(
          () => {
            this.isCopied = true;
          },
          () => {
            console.error("copy to clipboard failed");
          },
        );
      } else {
        console.debug("clipboard api not supported/enabled, fallback to select");
        if (window.getSelection) {
          console.debug("using 'window.getSelection'");
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(this.$refs["slot-wrapper"]);
          selection.removeAllRanges();
          selection.addRange(range);
          return;
        }
        if (document.body.createTextRange) {
          console.debug("using 'document.body.createTextRange'");
          const range = document.body.createTextRange();
          range.moveToElementText(this.$refs["slot-wrapper"]);
          range.select();
        } else {
          console.warn("could not select text, unsupported browser");
        }
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
