import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { nextTick } from "vue";
import App from "../../App.vue";
import store from "../../store";
import DisplayConfiguration from "../DisplayConfiguration.vue";
import OpenwbBaseSelectInput from "../../components/OpenwbBaseSelectInput.vue";
import OpenwbBaseTextInput from "../../components/OpenwbBaseTextInput.vue";
import OpenwbBaseSubmitButtons from "../../components/OpenwbBaseSubmitButtons.vue";
import OpenwbDisplayThemeProxy from "../../components/display_themes/OpenwbDisplayThemeProxy.vue";

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

function mountView(overrides = {}, realProxy = false) {
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
        OpenwbDisplayThemeProxy: !realProxy,
      },
    },
  });
  return wrapper;
}

function select(title) {
  return wrapper.findAllComponents(OpenwbBaseSelectInput).find((input) => input.props("title") === title);
}

function setTopic(topic, payload) {
  store.commit("updateTopic", { topic, payload });
}

afterEach(() => {
  wrapper?.unmount();
  vi.useRealTimers();
});

describe("Display configuration", () => {
  it.each(["primary", "local", undefined, "future"])("keeps primary settings for source %s", (mode) => {
    mountView({ [modeTopic]: mode });
    expect(select("Display-Quelle")).toBeUndefined();
    expect(select("Theme des Displays")).toBeDefined();
    expect(wrapper.text()).toContain("Ladepunkte auf secondary openWB");
    expect(wrapper.text()).toContain("Benutzerverwaltung");
    expect(wrapper.vm.mqttTopicsToPublish.includes(modeTopic)).toBe(["primary", "local"].includes(mode));
    expect(wrapper.vm.mqttTopicsToPublish).toContain(chargePointsTopic);
  });

  it.each(["primary", "local"])("shows secondary source %s independently of integrated display", (mode) => {
    mountView({ [externTopic]: true, [modeTopic]: mode });
    expect(select("Display-Quelle").find("select").element.value).toBe(mode);
    expect(Boolean(select("Theme des Displays"))).toBe(mode === "local");
    expect(wrapper.findComponent(OpenwbDisplayThemeProxy).exists()).toBe(mode === "local");
    expect(wrapper.text()).not.toContain("Ladepunkte auf secondary openWB");
    expect(wrapper.vm.mqttTopicsToPublish).toContain(chargePointsTopic);
    expect(store.state.mqtt[chargePointsTopic]).toBe(true);
    expect(wrapper.text()).not.toContain("Orientierung");
    expect(wrapper.text()).not.toContain("Display Standby");
    expect(wrapper.text()).toContain("Display-Einstiegsseite der secondary");
  });

  it.each([false, true])("preserves hardware controls for extern=%s", async (extern) => {
    mountView({ [externTopic]: extern, [activeTopic]: true });
    expect(wrapper.text()).toContain("Orientierung");
    expect(wrapper.text()).toContain("Display Standby");
    setTopic(activeTopic, false);
    await nextTick();
    expect(wrapper.text()).not.toContain("Orientierung");
    expect(wrapper.text()).not.toContain("Display Standby");
  });

  it("preserves the theme and source across source and device-mode switches", async () => {
    mountView({ [externTopic]: true, [modeTopic]: "local" });
    const storedTheme = store.state.mqtt[themeTopic];
    await select("Display-Quelle").find("select").setValue("primary");
    expect(select("Theme des Displays")).toBeUndefined();
    expect(store.state.mqtt[themeTopic]).toBe(storedTheme);
    await select("Display-Quelle").find("select").setValue("local");
    expect(store.state.mqtt[themeTopic]).toBe(storedTheme);
    setTopic(externTopic, false);
    await nextTick();
    setTopic(externTopic, true);
    await nextTick();
    expect(store.state.mqtt[modeTopic]).toBe("local");
    expect(store.state.mqtt[themeTopic]).toBe(storedTheme);
  });

  it("only replaces the theme with independent backend defaults on explicit selection", async () => {
    mountView({ [externTopic]: true, [modeTopic]: "local" });
    await select("Theme des Displays").find("select").setValue("url_display");
    expect(store.state.mqtt[themeTopic]).toEqual(urlDisplay);
    wrapper.vm.updateConfiguration(themeTopic, { value: "192.168.1.21", object: "configuration.url" });
    expect(store.state.mqtt[themeTopic].configuration.url).toBe("192.168.1.21");
    expect(store.state.mqtt[themesTopic][1].defaults).toEqual(urlDisplay);
  });

  it("saves the primary source without publishing hidden, unvalidated local theme edits", async () => {
    mountView({ [externTopic]: true, [modeTopic]: "local", [themeTopic]: clone(urlDisplay) });
    wrapper.vm.updateConfiguration(themeTopic, { value: "", object: "configuration.url" });
    await select("Display-Quelle").find("select").setValue("primary");
    await wrapper.find("#saveSettingsBtn").trigger("click");
    const topics = wrapper.emitted("save")[0][0];
    expect(topics).toContain(modeTopic);
    expect(topics).not.toContain(themeTopic);
    expect(store.state.mqtt[modeTopic]).toBe("primary");
    expect(store.state.mqtt[themeTopic].configuration.url).toBe("");
    await select("Display-Quelle").find("select").setValue("local");
    expect(store.state.mqtt[themeTopic].configuration.url).toBe("");
  });

  it.each([false, true])("retains backend-driven compatibility filtering for extern=%s", (extern) => {
    mountView({ [externTopic]: extern, [modeTopic]: "local", [usersTopic]: true });
    expect(
      select("Theme des Displays")
        .findAll("option")
        .map((option) => option.element.value),
    ).toEqual(["cards"]);
    expect(store.state.mqtt[themeTopic]).toEqual(colors);
  });

  it("does not hardcode URL Display availability", () => {
    mountView({ [themesTopic]: [themes[0]] });
    expect(
      select("Theme des Displays")
        .findAll("option")
        .map((option) => option.element.value),
    ).toEqual(["colors"]);
  });

  it.each([undefined, null, "future"])("does not replace an unloaded or unknown source %s", (mode) => {
    mountView({ [externTopic]: true, [modeTopic]: mode });
    expect(select("Display-Quelle")).toBeDefined();
    expect(select("Theme des Displays")).toBeUndefined();
    expect(store.state.mqtt[modeTopic]).toBe(mode);
    expect(wrapper.vm.mqttTopicsToPublish).not.toContain(modeTopic);
    expect(wrapper.emitted("save")).toBeUndefined();
    if (mode === undefined) {
      expect(select("Display-Quelle").find("select").element.disabled).toBe(true);
    }
  });

  it("waits for the device mode without treating an unloaded device as primary", () => {
    mountView({ [externTopic]: undefined });
    expect(select("Display-Quelle")).toBeUndefined();
    expect(select("Theme des Displays")).toBeUndefined();
    expect(wrapper.text()).not.toContain("Ladepunkte auf secondary openWB");
  });

  it("excludes read-only and unloaded topics from saving", () => {
    mountView({ [activeTopic]: undefined });
    expect(wrapper.vm.mqttTopicsToPublish).not.toContain(externTopic);
    expect(wrapper.vm.mqttTopicsToPublish).not.toContain(themesTopic);
    expect(wrapper.vm.mqttTopicsToPublish).not.toContain(usersTopic);
    expect(wrapper.vm.mqttTopicsToPublish).not.toContain(activeTopic);
  });

  it.each([undefined, null, {}, { type: "colors" }, { type: "colors", configuration: null }])(
    "blocks saving an incomplete local theme %j",
    async (theme) => {
      mountView({ [externTopic]: true, [modeTopic]: "local", [themeTopic]: theme });
      expect(wrapper.find("#saveSettingsBtn").element.disabled).toBe(true);
      await wrapper.find("#saveSettingsBtn").trigger("click");
      expect(wrapper.emitted("save")).toBeUndefined();
      expect(store.state.mqtt[themeTopic]).toEqual(theme);
    },
  );

  it.each([themesTopic, usersTopic])("waits for %s before exposing local theme controls", async (topic) => {
    mountView({ [externTopic]: true, [modeTopic]: "local", [topic]: undefined });
    expect(select("Theme des Displays")).toBeUndefined();
    expect(wrapper.find("#saveSettingsBtn").element.disabled).toBe(true);
    setTopic(topic, topic === themesTopic ? clone(themes) : false);
    await nextTick();
    expect(select("Theme des Displays")).toBeDefined();
    expect(wrapper.find("#saveSettingsBtn").element.disabled).toBe(false);
  });

  it("publishes the complete edited theme before the source via the existing save handler", async () => {
    mountView({ [externTopic]: true });
    await select("Display-Quelle").find("select").setValue("local");
    wrapper.vm.updateConfiguration(themeTopic, { value: "9876", object: "configuration.lock_changes_code" });
    await wrapper.find("#saveSettingsBtn").trigger("click");
    const topics = wrapper.emitted("save")[0][0];
    expect(topics.indexOf(themeTopic)).toBeLessThan(topics.indexOf(modeTopic));
    const doPublish = vi.fn();
    vi.useFakeTimers();
    const saving = App.methods.saveValues.call({ $store: store, doPublish }, topics);
    await vi.runAllTimersAsync();
    await saving;
    expect(doPublish).toHaveBeenCalledWith("openWB/set/general/extern_display_mode", "local");
    expect(doPublish).toHaveBeenCalledWith("openWB/set/optional/int_display/theme", {
      ...colors,
      configuration: { ...colors.configuration, lock_changes_code: "9876" },
    });
    expect(doPublish.mock.calls.map(([topic]) => topic)).not.toContain("openWB/set/general/extern");
  });

  it("resets source and theme by resubscribing to broker values", async () => {
    mountView({ [externTopic]: true, [modeTopic]: "local" });
    const brokerValues = clone(store.state.mqtt);
    expect(wrapper.vm.mqttTopicsToSubscribe).toContain(modeTopic);
    await select("Theme des Displays").find("select").setValue("url_display");
    await select("Display-Quelle").find("select").setValue("primary");
    wrapper.findComponent(OpenwbBaseSubmitButtons).vm.handleModalReset("confirm");
    expect(wrapper.emitted("reset")).toHaveLength(1);
    const topics = wrapper.vm.mqttTopicsToSubscribe;
    const doUnsubscribe = vi.fn((list) => list.forEach((topic) => store.commit("removeTopic", topic)));
    const doSubscribe = vi.fn((list) => list.forEach((topic) => setTopic(topic, brokerValues[topic])));
    App.methods.resetValues.call({ topicList: topics, doSubscribe, doUnsubscribe });
    await nextTick();
    expect(doUnsubscribe).toHaveBeenCalledWith(topics);
    expect(doSubscribe).toHaveBeenCalledWith(topics);
    expect(store.state.mqtt[modeTopic]).toBe("local");
    expect(store.state.mqtt[themeTopic]).toEqual(colors);
  });

  it("loads the URL form through the proxy, accepts schemeless input and validates required input", async () => {
    mountView({ [externTopic]: true, [modeTopic]: "local", [themeTopic]: clone(urlDisplay) }, true);
    await vi.dynamicImportSettled();
    await flushPromises();
    const input = wrapper.findComponent(OpenwbBaseTextInput).find("input");
    expect(input.element.value).toBe(urlDisplay.configuration.url);
    expect(input.attributes("type")).toBe("text");
    await input.setValue("192.168.1.30/dashboard");
    expect(store.state.mqtt[themeTopic].configuration.url).toBe("192.168.1.30/dashboard");
    expect(input.element.checkValidity()).toBe(true);
    await wrapper.find("#saveSettingsBtn").trigger("click");
    expect(wrapper.emitted("save")).toHaveLength(1);
    await input.setValue("");
    expect(input.element.checkValidity()).toBe(false);
    await wrapper.find("#saveSettingsBtn").trigger("click");
    expect(wrapper.emitted("save")).toHaveLength(1);
  });
});
