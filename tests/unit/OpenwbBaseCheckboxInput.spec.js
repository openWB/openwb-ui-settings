import { shallowMount } from "@vue/test-utils";
import OpenwbBaseCheckboxInput from "@/components/OpenwbBaseCheckboxInput.vue";

describe("OpenwbBaseCheckboxInput.vue", () => {
	// check title prop
	it("render title", () => {
		const title = "Checkbox Test";
		const wrapper = shallowMount(OpenwbBaseCheckboxInput, {
			props: { title },
		});
		const titleLabel = wrapper.find("label.col-form-label");
		expect(titleLabel.html()).toContain(title);
	});
	// check help slot
	it("show help symbol", () => {
		const helpContent = "This is our help text.";
		const wrapper = shallowMount(OpenwbBaseCheckboxInput, {
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
		const wrapper = shallowMount(OpenwbBaseCheckboxInput, {
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
	it("render checkbox", () => {
		const modelValue = true;
		const wrapper = shallowMount(OpenwbBaseCheckboxInput, {
			props: { modelValue },
		});
		const renderedCheckbox = wrapper.find("input[type=checkbox]");
		expect(renderedCheckbox.exists()).toBe(true);
	});
	// check user input
	it("emit on click", async () => {
		const modelValue = false;
		const wrapper = shallowMount(OpenwbBaseCheckboxInput, {
			props: { modelValue },
		});
		const renderedCheckbox = wrapper.find("input[type=checkbox]");
		await renderedCheckbox.trigger("click");
		expect(wrapper.emitted("update:modelValue")[0]).toStrictEqual([true]);
	});
});
