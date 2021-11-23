import { shallowMount } from "@vue/test-utils";
import OpenwbBaseNumberInput from "@/components/OpenwbBaseNumberInput.vue";

describe("OpenwbBaseNumberInput.vue", () => {
	// check title prop
	it("render title", () => {
		const title = "Number Input Test";
		const wrapper = shallowMount(OpenwbBaseNumberInput, {
			props: { title },
		});
		const titleLabel = wrapper.find("label.col-form-label");
		expect(titleLabel.html()).toContain(title);
	});
	// check unit prop
	it("render unit", () => {
		const unit = "$";
		const wrapper = shallowMount(OpenwbBaseNumberInput, {
			props: { unit },
		});
		const unitDiv = wrapper.find("div.input-group-append");
		expect(unitDiv.html()).toContain(unit);
	});
	// check help slot
	it("show help symbol", () => {
		const helpContent = "This is our help text.";
		const wrapper = shallowMount(OpenwbBaseNumberInput, {
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
		const wrapper = shallowMount(OpenwbBaseNumberInput, {
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
		const modelValue = 2;
		const wrapper = shallowMount(OpenwbBaseNumberInput, {
			props: { modelValue },
		});
		const renderedInput = wrapper.find("input[type=number]");
		expect(parseInt(renderedInput.element.value)).toBe(modelValue);
	});
	// check user input
	it("emit on change", async () => {
		const modelValue = 2;
		const wrapper = shallowMount(OpenwbBaseNumberInput, {
			props: { modelValue },
		});
		const renderedInput = wrapper.find("input[type=number]");
		await renderedInput.setValue(10);
		expect(wrapper.emitted("update:modelValue")[0]).toStrictEqual([10]);
	});
});
