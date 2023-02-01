import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import OpenwbBaseAvatar from "@/components/OpenwbBaseAvatar.vue";

describe("OpenwbBaseAvatar.vue", () => {
	it("render slot when passed", () => {
		const slotContent = "!";
		const wrapper = shallowMount(OpenwbBaseAvatar, {
			slots: {
				default: slotContent,
			},
		});
		const mainDiv = wrapper.find("div.avatar");
		expect(mainDiv.html()).toContain(slotContent);
	});
});
