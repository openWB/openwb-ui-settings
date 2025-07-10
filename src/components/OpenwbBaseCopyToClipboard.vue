<template>
  <span
    :title="isCopied ? '' : tooltip"
    :class="isCopied ? '' : 'copy-me'"
    @click.stop="click"
  >
    <span ref="content">
      <slot />
    </span>
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
      if (this.clipboardApiAvailable) {
        navigator.clipboard.writeText(this.$refs["content"].innerText.trim()).then(
          () => {
            this.isCopied = true;
            setTimeout(() => {
              this.isCopied = false;
            }, 3000); // Nach 3 Sekunden zurücksetzen
          },
          () => {
            console.error("copy to clipboard failed");
          },
        );
      } else {
        console.debug("clipboard api not supported/enabled, fallback to selection or text range");
        if (window.getSelection) {
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(this.$refs["content"]);
          selection.removeAllRanges();
          selection.addRange(range);
          return;
        }
        if (document.body.createTextRange) {
          const range = document.body.createTextRange();
          range.moveToElementText(this.$refs["content"]);
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
