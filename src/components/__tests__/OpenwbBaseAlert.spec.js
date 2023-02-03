import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import OpenwbBaseAlert from "../OpenwbBaseAlert.vue";

describe("OpenwbBaseAlert.vue", () => {
	it("adds class props.subtype when passed", () => {
		const subtype = "info";
		const wrapper = shallowMount(OpenwbBaseAlert, {
			props: { subtype },
		});
		const mainDiv = wrapper.find("div.alert");
		expect(mainDiv.classes()).toContain("alert-" + subtype);
	});
	it("render slot when passed", () => {
		const slotContent = "<span>Default slot message</span>";
		const wrapper = shallowMount(OpenwbBaseAlert, {
			slots: {
				default: slotContent,
			},
		});
		const mainDiv = wrapper.find("div.alert");
		expect(mainDiv.html()).toContain(slotContent);
	});
});
