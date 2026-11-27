import { afterEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import store from "../../store";
import DisplayConfiguration from "../DisplayConfiguration.vue";
import OpenwbBaseSelectInput from "../../components/OpenwbBaseSelectInput.vue";
import OpenwbBaseTextInput from "../../components/OpenwbBaseTextInput.vue";
import OpenwbBaseSubmitButtons from "../../components/OpenwbBaseSubmitButtons.vue";

const externTopic = "openWB/general/extern";
const modeTopic = "openWB/general/extern_display_mode";
const themeTopic = "openWB/optional/int_display/theme";
const themesTopic = "openWB/system/configurable/display_themes";
const usersTopic = "openWB/system/security/user_management_active";
const chargePointsTopic = "openWB/optional/int_display/only_local_charge_points";
const activeTopic = "openWB/optional/int_display/active";
const colors = {
  type: "colors",
  name: "Colors",
  official: true,
  userManagementSupported: false,
  configuration: { lock_changes: false, lock_changes_code: "1234" },
};
const urlDisplay = {
  type: "url_display",
  name: "URL Display",
  official: true,
  userManagementSupported: false,
  configuration: { url: "http://192.168.1.20/" },
};
const themes = [
  { value: "colors", text: "Colors", official: true, defaults: colors },
  { value: "url_display", text: "URL Display", official: true, defaults: urlDisplay },
  {
    value: "cards",
    text: "Cards",
    official: false,
    defaults: { type: "cards", userManagementSupported: true, configuration: {} },
  },
];
const clone = (value) => JSON.parse(JSON.stringify(value));
const slotStub = { template: "<div><slot /></div>" };
const settingStub = {
  props: ["title", "modelValue"],
  template: "<div>{{ title }}<slot /></div>",
};
let wrapper;

function mountView(overrides = {}) {
  store.replaceState({
    mqtt: {
      [externTopic]: false,
      [modeTopic]: "primary",
      [activeTopic]: false,
      [chargePointsTopic]: true,
      [themeTopic]: clone(colors),
      [themesTopic]: clone(themes),
      [usersTopic]: false,
      ...overrides,
    },
    local: { savingData: false },
    examples: {},
  });
  wrapper = mount(DisplayConfiguration, {
    attachTo: document.body,
    global: {
      plugins: [store],
      mixins: [{ methods: { doSubscribe: vi.fn(), doUnsubscribe: vi.fn() } }],
      components: { OpenwbBaseSelectInput, OpenwbBaseTextInput, OpenwbBaseSubmitButtons },
      stubs: {
        OpenwbBaseCard: slotStub,
        OpenwbBaseAlert: slotStub,
        OpenwbBaseHeading: slotStub,
        OpenwbBaseTooltip: slotStub,
        OpenwbBaseModalDialog: true,
        OpenwbBaseButtonGroupInput: settingStub,
        OpenwbBaseRangeInput: settingStub,
        OpenwbDisplayThemeProxy: true,
      },
    },
  });
  return wrapper;
}

function select(title) {
  return wrapper.findAllComponents(OpenwbBaseSelectInput).find((input) => input.props("title") === title);
}

afterEach(() => {
  wrapper?.unmount();
  vi.useRealTimers();
});

describe("Display configuration", () => {
  it("shows the primary settings and no source selection on a primary openWB", () => {
    mountView();
    expect(select("Display-Quelle")).toBeUndefined();
    expect(select("Theme des Displays")).toBeDefined();
    expect(wrapper.text()).toContain("Ladepunkte auf secondary openWB");
  });

  it.each(["primary", "local"])("offers the theme on a secondary only for source local (%s)", (mode) => {
    mountView({ [externTopic]: true, [modeTopic]: mode });
    expect(select("Display-Quelle").find("select").element.value).toBe(mode);
    expect(Boolean(select("Theme des Displays"))).toBe(mode === "local");
    expect(wrapper.text()).not.toContain("Ladepunkte auf secondary openWB");
  });

  it("publishes the theme before the display source", () => {
    mountView({ [externTopic]: true, [modeTopic]: "local" });
    const topics = wrapper.vm.mqttTopicsToPublish;
    expect(topics.indexOf(themeTopic)).toBeLessThan(topics.indexOf(modeTopic));
  });
});
