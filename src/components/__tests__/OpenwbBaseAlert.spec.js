import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OpenwbBaseAlert from "../OpenwbBaseAlert.vue";

describe("OpenwbBaseAlert.vue", () => {
	it("adds class props.subtype when passed", () => {
		const subtype = "info";
		const wrapper = mount(OpenwbBaseAlert, {
			props: { subtype },
		});
		const mainDiv = wrapper.find("div.alert");
		expect(mainDiv.classes()).toContain("alert-" + subtype);
	});
	it("render slot when passed", () => {
		const slotContent = "<span>Default slot message</span>";
		const wrapper = mount(OpenwbBaseAlert, {
			slots: {
				default: slotContent,
			},
		});
		const mainDiv = wrapper.find("div.alert");
		expect(mainDiv.html()).toContain(slotContent);
	});
});
