import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OpenwbBaseSubmitButtons from "../OpenwbBaseSubmitButtons.vue";

describe("OpenwbBaseSubmitButtons", () => {
  it("renders correctly", () => {
    const wrapper = mount(OpenwbBaseSubmitButtons, {
      global: {
        stubs: {
          OpenwbBaseModalDialog: { template: "<div />" },
          FontAwesomeIcon: { template: "<span />" },
        },
        mocks: {
          $store: { state: { local: { savingData: false } } },
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("emits save event when save button is clicked", async () => {
    const wrapper = mount(OpenwbBaseSubmitButtons, {
      global: {
        stubs: {
          OpenwbBaseModalDialog: { template: "<div />" },
          FontAwesomeIcon: { template: "<span />" },
        },
        mocks: {
          $store: { state: { local: { savingData: false } } },
        },
      },
    });
    const button = wrapper.find("#saveSettingsBtn");
    await button.trigger("click");
    expect(wrapper.emitted("save")).toBeTruthy();
  });
});
