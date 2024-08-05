import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OpenwbBaseRangeInput from "../OpenwbBaseRangeInput.vue";

describe("OpenwbBaseRangeInput.vue", () => {
	// check title prop
	it("render title", () => {
		const title = "Range Input Test";
		const wrapper = mount(OpenwbBaseRangeInput, {
			props: { title },
		});
		const titleLabel = wrapper.find("label.col-form-label");
		expect(titleLabel.html()).toContain(title);
	});
	// check unit prop
	it("render unit", () => {
		const modelValue = 2;
		const unit = "$";
		const wrapper = mount(OpenwbBaseRangeInput, {
			props: { modelValue, unit },
		});
		const unitDiv = wrapper.find("label.valueLabel");
		expect(unitDiv.html()).toContain(unit);
	});
	// check initial value
	it("display initial value", () => {
		const modelValue = 2;
		const wrapper = mount(OpenwbBaseRangeInput, {
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
		const wrapper = mount(OpenwbBaseRangeInput, {
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
