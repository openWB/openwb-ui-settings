import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import OpenwbBaseRangeInput from "../OpenwbBaseRangeInput.vue";

describe("OpenwbBaseRangeInput.vue", () => {
	// check title prop
	it("render title", () => {
		const title = "Range Input Test";
		const wrapper = shallowMount(OpenwbBaseRangeInput, {
			props: { title },
		});
		const titleLabel = wrapper.find("label.col-form-label");
		expect(titleLabel.html()).toContain(title);
	});
	// check unit prop
	it("render unit", () => {
		const modelValue = 2;
		const unit = "$";
		const wrapper = shallowMount(OpenwbBaseRangeInput, {
			props: { modelValue, unit },
		});
		const unitDiv = wrapper.find("label.valueLabel");
		expect(unitDiv.html()).toContain(unit);
	});
	// check help slot
	it("show help symbol", () => {
		const helpContent = "This is our help text.";
		const wrapper = shallowMount(OpenwbBaseRangeInput, {
			slots: {
				help: helpContent,
			},
		});
		const titleLabel = wrapper.find("label.col-form-label");
		expect(titleLabel.html()).toContain("question-circle");
	});
	it("show help slot when title is clicked", async () => {
		const title = "Number Input Test";
		const helpContent = "This is our help text.";
		const wrapper = shallowMount(OpenwbBaseRangeInput, {
			props: { title },
			slots: {
				help: helpContent,
			},
		});
		const titleLabel = wrapper.find("label.col-form-label");
		expect(wrapper.find("div.alert.alert-info").exists()).toBe(false);
		await titleLabel.trigger("click");
		expect(wrapper.find("div.alert.alert-info").html()).toContain(
			helpContent
		);
	});
	// check initial value
	it("display initial value", () => {
		const modelValue = 2;
		const wrapper = shallowMount(OpenwbBaseRangeInput, {
			props: { modelValue },
		});
		const renderedInput = wrapper.find("input[type=range]");
		expect(parseInt(renderedInput.element.value)).toBe(modelValue);
	});
	// check user input
	it("user input", async () => {
		const modelValue = 15;
		const step = 5;
		const min = 10;
		const max = 20;
		const wrapper = shallowMount(OpenwbBaseRangeInput, {
			props: { modelValue, min, max, step },
		});
		const renderedInput = wrapper.find("input[type=range]");
		const renderedButtons = wrapper.findAll("button");
		// click decrement button
		await renderedButtons[0].trigger("click");
		expect(wrapper.emitted("update:modelValue")[0]).toStrictEqual([10]);
		// click increment button
		await renderedButtons[1].trigger("click");
		expect(wrapper.emitted("update:modelValue")[1]).toStrictEqual([20]);
		// direct input
		await renderedInput.setValue(10);
		expect(wrapper.emitted("update:modelValue")[2]).toStrictEqual([10]);
	});
});
