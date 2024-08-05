import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OpenwbBaseAvatar from "../OpenwbBaseAvatar.vue";

describe("OpenwbBaseAvatar.vue", () => {
	it("render slot when passed", () => {
		const slotContent = "!";
		const wrapper = mount(OpenwbBaseAvatar, {
			slots: {
				default: slotContent,
			},
		});
		const mainDiv = wrapper.find("div.avatar");
		expect(mainDiv.html()).toContain(slotContent);
	});
});
