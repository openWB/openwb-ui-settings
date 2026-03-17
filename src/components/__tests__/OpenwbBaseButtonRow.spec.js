import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OpenwbBaseButtonRow from "../OpenwbBaseButtonRow.vue";

describe("OpenwbBaseButtonRow", () => {
  it("renders correctly", () => {
    const wrapper = mount(OpenwbBaseButtonRow, {
      props: {
        buttons: [{ value: "a", label: "A" }],
        uid: "test-uid",
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("emits click event", async () => {
    const wrapper = mount(OpenwbBaseButtonRow, {
      props: {
        buttons: [{ value: "a", label: "A" }],
        uid: "test-uid",
      },
    });
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeTruthy();
  });
});
