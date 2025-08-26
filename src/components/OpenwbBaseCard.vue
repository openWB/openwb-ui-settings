<template>
  <div
    class="card"
    :class="'border-' + subtype"
  >
    <div
      v-if="title !== undefined || $slots.header"
      class="card-header py-1"
      :class="'bg-' + subtype"
      @click="toggleBody"
    >
      <div class="form-group mb-0">
        <div class="form-row vaRow mb-0 py-2">
          <div class="col">
            <slot
              name="header"
              :collapsed="isCollapsed"
            >
              {{ title }}
            </slot>
          </div>
        </div>
      </div>
      <div class="card-actions ml-4">
        <div
          v-if="$slots.actions"
          class="card-actions mr-2"
        >
          <slot
            name="actions"
            :collapsed="isCollapsed"
          />
        </div>
        <font-awesome-icon
          v-if="collapsible"
          :icon="isCollapsed ? ['fas', 'chevron-right'] : ['fas', 'chevron-down']"
        />
      </div>
    </div>
    <div
      v-if="isCollapsed === false"
      class="card-body"
      :class="[
        title == undefined && !$slots.header ? 'border-radius-top-inherit' : '',
        $slots.footer ? '' : 'border-radius-bottom-inherit',
        'bg-' + bodyBg,
      ]"
      v-bind="$attrs"
    >
      <slot />
    </div>
    <div
      v-if="$slots.footer && isCollapsed === false"
      class="card-footer"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faChevronRight as fasChevronRight, faChevronDown as fasChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasChevronRight, fasChevronDown);

export default {
  name: "OpenwbCard",
  components: {
    FontAwesomeIcon,
  },
  inheritAttrs: false,
  props: {
    title: { type: String, default: undefined },
    subtype: {
      validator: function (value) {
        return (
          ["info", "success", "warning", "danger", "primary", "secondary", "light", "dark", "pink", "white"].indexOf(
            value,
          ) !== -1
        );
      },
      default: "secondary",
    },
    bodyBg: {
      validator: function (value) {
        return (
          ["info", "success", "warning", "danger", "primary", "secondary", "light", "dark", "pink", "white"].indexOf(
            value,
          ) !== -1
        );
      },
      default: "light",
    },
    collapsible: { type: Boolean, default: false },
    collapsed: { type: Boolean, default: false },
  },
  emits: ["collapsed", "expanded"],
  data() {
    return {
      isCollapsed: this.collapsible && this.collapsed,
    };
  },

  methods: {
    toggleBody() {
      if (this.collapsible === true) {
        this.isCollapsed = !this.isCollapsed;
        this.$emit(this.isCollapsed ? "collapsed" : "expanded");
      }
    },
  },
};
</script>

<style scoped>
.card {
  margin-bottom: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.card :deep(.card:last-of-type) {
  margin-bottom: 0;
}

.card .card-header {
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: none;
}

.card-header > .card-actions > .card-actions {
  font-size: 90%;
  font-weight: normal;
}

.card-actions {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.card-actions :deep(.pill) {
  border-radius: 10px;
  padding: 5px;
  border-width: 2px;
  border-style: solid;
}

.card-header.bg-secondary .btn-outline-info:not(.active):not(:hover),
.card-header.bg-success .btn-outline-info:not(.active):not(:hover),
.card-header.bg-primary .btn-outline-info:not(.active):not(:hover) {
  background-color: white;
}

.card-header.bg-success .btn-outline-info.focus {
  box-shadow: 0 0 0 0.2rem white;
}

.card-header.bg-success .btn-outline-info.active,
.card-header.bg-success .btn-outline-info:hover {
  border-color: white;
}

.card.border-white {
  background-color: bg-border-white; /* Ensure this matches the background color of other elements */
}

.card-header :deep(.card.border-white) {
  background-color: inherit; /* Change this to match the background color of the card body */
}

.card-body.border-radius-top-inherit {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.card-body.border-radius-bottom-inherit {
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}
</style>
