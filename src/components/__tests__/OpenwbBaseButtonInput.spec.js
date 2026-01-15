import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OpenwbBaseButtonInput from "../OpenwbBaseButtonInput.vue";

describe("OpenwbBaseButtonInput.vue", () => {
  // general constants
  const title = "Button Test";
  const buttonText = "Test Button";
  const buttonSubtype = "success";
  // check title prop
  it("render title", () => {
    const wrapper = mount(OpenwbBaseButtonInput, {
      props: { title, buttonText, buttonSubtype },
    });
    const titleLabel = wrapper.find("div.col-form-label");
    expect(titleLabel.html()).toContain(title);
  });
});
