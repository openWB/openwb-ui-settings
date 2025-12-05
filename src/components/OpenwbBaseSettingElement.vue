<template>
  <div
    class="form-row"
    :class="$slots.title ? 'mb-1' : 'mx-0'"
  >
    <div
      v-if="$slots.title"
      class="col-md-4 col-form-label"
    >
      <slot name="title" />
      <font-awesome-icon
        v-if="$slots.help"
        :icon="showHelp ? ['fas', 'question-circle'] : ['far', 'question-circle']"
        class="clickable ml-1"
        :class="showHelp ? 'text-info' : ''"
        @click.stop="toggleHelp"
      />
    </div>
    <div :class="$slots.title ? 'col-md-8' : 'col px-0'">
      <div :class="{ 'form-row': $slots.title }">
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

<style scoped>
.form-text.alert {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.form-text.alert :deep(p:last-of-type) {
  margin-bottom: 0;
}
</style>
