import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import OpenwbBaseArrayInput from "@/components/OpenwbBaseArrayInput.vue";

describe("OpenwbBaseNumberInput.vue", () => {
	// check title prop
	it("render title", () => {
		const title = "Array Input Test";
		const wrapper = shallowMount(OpenwbBaseArrayInput, {
			props: { title },
		});
		const titleLabel = wrapper.find("label.col-form-label");
		expect(titleLabel.html()).toContain(title);
	});
	// check help slot
	it("show help symbol", () => {
		const helpContent = "This is our help text.";
		const wrapper = shallowMount(OpenwbBaseArrayInput, {
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
		const wrapper = shallowMount(OpenwbBaseArrayInput, {
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
	// check initial value
	it("display initial value", () => {
		const modelValue = ["1234", "2345"];
		const wrapper = shallowMount(OpenwbBaseArrayInput, {
			props: { modelValue },
		});
		const renderedTagList = wrapper.find(".tagList");
		modelValue.forEach((element) => {
			expect(renderedTagList.html()).toContain(element);
		});
	});
	// check user input
	it("add element", async () => {
		const newTag = "1234";
		const wrapper = shallowMount(OpenwbBaseArrayInput, {});
		const renderedTextInput = wrapper.find("input[type=text]");
		await renderedTextInput.setValue(newTag);
		const renderedAddButton = wrapper.find(
			".input-group-append font-awesome-icon-stub"
		);
		await renderedAddButton.trigger("click");
		expect(wrapper.emitted("update:modelValue")[0]).toStrictEqual([
			[newTag],
		]);
	});
});
