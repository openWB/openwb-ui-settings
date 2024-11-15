<template>
  <teleport
    v-if="show"
    to="body"
  >
    <div class="modal-backdrop fade show" />
    <div
      class="modal fade d-block show"
      role="dialog"
      @click="handleClick"
    >
      <div
        class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
        role="document"
      >
        <div class="modal-content">
          <!-- modal header -->
          <div
            class="modal-header"
            :class="'bg-' + subtype"
          >
            <h4 class="modal-title">
              {{ title }}
            </h4>
            <button
              v-if="!preventClose"
              type="button"
              class="close"
              @click="handleClick"
            >
              &times;
            </button>
          </div>
          <!-- modal body -->
          <div class="modal-body">
            <slot># Body #</slot>
          </div>
          <!-- modal footer -->
          <div
            v-if="myButtons.length > 0"
            class="modal-footer d-flex"
            :class="'justify-content-' + footerAlignment"
          >
            <button
              v-for="button in myButtons"
              :key="button.text"
              type="button"
              class="btn"
              :class="button.subtype ? 'btn-' + button.subtype : 'btn-secondary'"
              data-dismiss="modal"
              :data-event="button.event ? button.event : 'close'"
              @click="handleClick"
            >
              {{ button.text }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: "OpenwbModalDialog",
  props: {
    title: { type: String, required: false, default: "" },
    subtype: {
      type: String,
      validator: function (value) {
        return ["info", "success", "warning", "danger", "primary", "secondary", "light", "dark"].indexOf(value) !== -1;
      },
      default: "secondary",
    },
    buttons: { type: Array, default: undefined },
    footerAlignment: {
      type: String,
      validator: function (value) {
        return ["around", "between", "center", "end", "start"].indexOf(value) !== -1;
      },
      default: "end",
    },
    preventClose: { type: Boolean, default: false },
    show: { type: Boolean, default: false },
  },
  emits: ["modal-result"],
  computed: {
    myButtons() {
      var buttons = [];
      if (this.buttons !== undefined) {
        buttons = this.buttons;
      }
      if (!this.preventClose) {
        buttons.push({ text: "Schließen", event: "close" });
      }
      return buttons;
    },
  },
  methods: {
    handleClick(event) {
      event.stopPropagation();
      let data = event.target.getAttribute("data-event");
      if (data === null) {
        data = "close";
      }
      if (data != "close" || !this.preventClose) {
        this.$emit("modal-result", data);
      }
    },
  },
};
</script>
