import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import OpenwbBaseButtonGroupInput from "../OpenwbBaseButtonGroupInput.vue";

describe("OpenwbBaseButtonGroupInput.vue", () => {
	// check title prop
	it("render title", () => {
		const title = "Button Group Test";
		const wrapper = shallowMount(OpenwbBaseButtonGroupInput, {
			props: { title },
		});
		const titleLabel = wrapper.find("label.col-form-label");
		expect(titleLabel.html()).toContain(title);
	});
	// check help slot
	it("show help symbol", () => {
		const helpContent = "This is our help text.";
		const wrapper = shallowMount(OpenwbBaseButtonGroupInput, {
			slots: {
				help: helpContent,
			},
		});
		const titleLabel = wrapper.find("label.col-form-label");
		expect(titleLabel.html()).toContain("question-circle");
	});
	it("show help slot when title is clicked", async () => {
		const title = "Button Group Test";
		const helpContent = "This is our help text.";
		const wrapper = shallowMount(OpenwbBaseButtonGroupInput, {
			props: { title },
			slots: {
				help: helpContent,
			},
		});
		const titleLabel = wrapper.find("label.col-form-label");
		expect(wrapper.find("span.alert.alert-info").exists()).toBe(false);
		await titleLabel.trigger("click");
		expect(wrapper.find("span.alert.alert-info").html()).toContain(
			helpContent
		);
	});
	// check buttons
	it("render buttons", () => {
		const buttons = [
			{ buttonValue: 1, text: "Button 1" },
			{ buttonValue: 2, text: "Button 2" },
		];
		const modelValue = 2;
		const wrapper = shallowMount(OpenwbBaseButtonGroupInput, {
			props: { buttons, modelValue },
		});
		const renderedButtons = wrapper.findAll("label.btn");
		expect(renderedButtons[0].classes("active")).toBe(false);
		expect(renderedButtons[1].classes("active")).toBe(true);
	});
	// check user input
	it("emit on click", async () => {
		const buttons = [
			{ buttonValue: 1, text: "Button 1" },
			{ buttonValue: 2, text: "Button 2" },
		];
		const modelValue = 2;
		const wrapper = shallowMount(OpenwbBaseButtonGroupInput, {
			props: { buttons, modelValue },
		});
		const renderedButtons = wrapper.findAll("input[type=radio]");
		await renderedButtons[0].setValue(1);
		expect(wrapper.emitted("update:modelValue")[0]).toStrictEqual([1]);
	});
});
