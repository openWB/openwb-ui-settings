import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import OpenwbBaseHeading from "@/components/OpenwbBaseHeading.vue";

describe("OpenwbBaseHeading.vue", () => {
	it("render default slot when passed", () => {
		const slotContent = "<span>Default slot content.</span>";
		const wrapper = shallowMount(OpenwbBaseHeading, {
			slots: {
				default: slotContent,
			},
		});
		const heading = wrapper.find("div.card-text-heading");
		expect(heading.html()).toContain(slotContent);
	});
	it("render actions slot when passed", () => {
		const slotContent = "<span>Actions slot content.</span>";
		const wrapper = shallowMount(OpenwbBaseHeading, {
			slots: {
				actions: slotContent,
			},
		});
		const headingActions = wrapper.find("span.actions");
		expect(headingActions.html()).toContain(slotContent);
	});
});
