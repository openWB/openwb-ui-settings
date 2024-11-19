import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OpenwbBaseSettingElement from "../OpenwbBaseSettingElement.vue";

describe("OpenwbBaseSettingElement.vue", () => {
  // check title slot
  it("render title", () => {
    const title = "Base Setting Element Test";
    const wrapper = mount(OpenwbBaseSettingElement, {
      slots: { title: title },
    });
    const titleLabel = wrapper.find("label.col-form-label");
    expect(titleLabel.html()).toContain(title);
  });
  // check help slot
  it("show help symbol", () => {
    const title = "Base Setting Element Test";
    const helpContent = "This is our help text.";
    const wrapper = mount(OpenwbBaseSettingElement, {
      slots: {
        title: title,
        help: helpContent,
      },
    });
    const titleLabel = wrapper.find("label.col-form-label");
    expect(titleLabel.html()).toContain("question-circle");
  });
  it("show help slot when title is clicked", async () => {
    const title = "Base Setting Element Test";
    const helpContent = "This is our help text.";
    const wrapper = mount(OpenwbBaseSettingElement, {
      slots: {
        title: title,
        help: helpContent,
      },
    });
    const titleLabel = wrapper.find("label.col-form-label svg.clickable");
    expect(wrapper.find("span.alert.alert-info").exists()).toBe(false);
    await titleLabel.trigger("click");
    expect(wrapper.find("span.alert.alert-info").html()).toContain(helpContent);
  });
});
