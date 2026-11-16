import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { reactive } from "vue";
import SystemConfiguration from "../SystemConfiguration.vue";

function mountSystemConfiguration(mqtt = {}) {
  return shallowMount(SystemConfiguration, {
    props: { installAssistantActive: true },
    global: {
      renderStubDefaultSlot: true,
      mixins: [{ methods: { doSubscribe: vi.fn(), doUnsubscribe: vi.fn() } }],
      mocks: { $store: { state: { mqtt } } },
      stubs: {
        OpenwbBaseCard: true,
        OpenwbBaseTextInput: {
          name: "OpenwbBaseTextInput",
          props: ["title", "modelValue"],
          template: '<input :value="modelValue" />',
        },
        OpenwbBaseAlert: true,
        OpenwbBaseClickButton: true,
        OpenwbBaseSelectInput: true,
      },
    },
  });
}

describe("System information", () => {
  it("shows the read-only OS version directly below the hostname and updates it from MQTT", async () => {
    const mqtt = reactive({ "openWB/system/os_version": "Debian GNU/Linux 12" });
    const wrapper = mountSystemConfiguration(mqtt);
    const fields = wrapper.findAllComponents({ name: "OpenwbBaseTextInput" });
    const hostnameIndex = fields.findIndex((field) => field.props("title") === "Hostname");
    const osVersion = fields[hostnameIndex + 1];

    expect(osVersion.props("title")).toBe("OS-Version");
    expect(osVersion.props("modelValue")).toBe("Debian GNU/Linux 12");
    expect(osVersion.attributes()).toHaveProperty("readonly");
    expect(wrapper.vm.mqttTopicsToSubscribe).toContain("openWB/system/os_version");
    expect(wrapper.vm.mqttTopicsToPublish).not.toContain("openWB/system/os_version");

    mqtt["openWB/system/os_version"] = "Debian GNU/Linux 13";
    await wrapper.vm.$nextTick();
    expect(osVersion.props("modelValue")).toBe("Debian GNU/Linux 13");
    wrapper.unmount();
  });

  it("still renders the OS version field when an older backend has not published it", () => {
    const wrapper = mountSystemConfiguration();
    const osVersion = wrapper
      .findAllComponents({ name: "OpenwbBaseTextInput" })
      .find((field) => field.props("title") === "OS-Version");

    expect(osVersion.exists()).toBe(true);
    expect(osVersion.props("modelValue")).toBeUndefined();
    wrapper.unmount();
  });
});
