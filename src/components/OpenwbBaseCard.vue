<template>
  <div
    class="card"
    :class="'border-' + subtype"
  >
    <div
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
      <span class="card-actions ml-4">
        <span
          v-if="$slots.actions"
          class="card-actions mr-4"
        >
          <slot
            name="actions"
            :collapsed="isCollapsed"
          />
        </span>
        <font-awesome-icon
          v-if="collapsible"
          fixed-width
          :icon="isCollapsed ? ['fas', 'chevron-right'] : ['fas', 'chevron-down']"
        />
      </span>
    </div>
    <div
      v-if="isCollapsed === false"
      class="card-body"
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
    title: { type: String, default: "# no title set #" },
    subtype: {
      validator: function (value) {
        return (
          ["info", "success", "warning", "danger", "primary", "secondary", "light", "dark", "pink"].indexOf(value) !==
          -1
        );
      },
      default: "secondary",
    },
    collapsible: { type: Boolean, default: false },
    collapsed: { type: Boolean, default: false },
  },
  data() {
    return {
      isCollapsed: this.collapsible && this.collapsed,
    };
  },
  methods: {
    toggleBody() {
      if (this.collapsible === true) {
        this.isCollapsed = !this.isCollapsed;
      }
    },
  },
};
</script>

<style>
.card {
  margin-bottom: 1rem;
}

.card .card-header {
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card .card-header .subheader {
  font-weight: normal;
  font-size: 75%;
}

.card-actions {
  display: flex;
  align-items: center;
}

.card-actions .pill {
  border-radius: 10px;
  padding: 5px;
  border-width: 2px;
  border-style: solid;
}

.border-pink {
  border-color: var(--pink) !important;
}

.bg-pink {
  background-color: var(--pink) !important;
}

.bg-primary,
.bg-secondary,
.bg-info,
.bg-danger,
.bg-success,
.bg-dark {
  color: white;
}

.bg-warning,
.bg-pink,
.bg-light {
  color: #212529;
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
</style>
