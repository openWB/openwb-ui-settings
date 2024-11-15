<template>
  <div class="form-row mb-1">
    <label class="col-md-4 col-form-label">
      <slot name="title">*TITLE*</slot>
      <font-awesome-icon
        v-if="$slots.help"
        :icon="showHelp ? ['fas', 'question-circle'] : ['far', 'question-circle']"
        class="clickable ml-1"
        :class="showHelp ? 'text-info' : ''"
        @click.stop="toggleHelp"
      />
    </label>
    <div class="col-md-8">
      <div class="form-row">
        <slot>*ELEMENT MISSING*</slot>
      </div>
      <div class="form-row">
        <span
          v-if="showHelp"
          class="form-text alert alert-info my-1 small flex-fill"
        >
          <slot name="help" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faQuestionCircle as fasQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle as farQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasQuestionCircle, farQuestionCircle);

export default {
  name: "OpenwbBaseSettingElement",
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      showHelp: false,
    };
  },
  methods: {
    toggleHelp() {
      this.showHelp = !this.showHelp && this.$slots.help !== undefined;
    },
  },
};
</script>
