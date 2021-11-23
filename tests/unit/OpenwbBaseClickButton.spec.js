import { shallowMount } from "@vue/test-utils";
import OpenwbBaseClickButton from "@/components/OpenwbBaseClickButton.vue";

describe("OpenwbBaseClickbutton.vue", () => {
	// check title prop
	it("render title", () => {
		const title = "T";
		const wrapper = shallowMount(OpenwbBaseClickButton, {
			props: { title },
		});
		const renderedButton = wrapper.find("button");
		expect(renderedButton.html()).toContain(title);
	});
	// check default slot
	it("render default slot", () => {
		const title = "T";
		const slotContent = "<span>T</span>";
		const wrapper = shallowMount(OpenwbBaseClickButton, {
			props: { title },
			slots: {
				default: slotContent,
			},
		});
		const renderedButton = wrapper.find("button");
		expect(renderedButton.html()).toContain(slotContent);
	});
	// check user input
	it("emit on click", async () => {
		const title = "T";
		const wrapper = shallowMount(OpenwbBaseClickButton, {
			props: { title },
		});
		const renderedButton = wrapper.find("button");
		await renderedButton.trigger("click");
		expect(wrapper.emitted("buttonClicked").length).toBe(1);
		await renderedButton.trigger("click");
		expect(wrapper.emitted("buttonClicked").length).toBe(2);
	});
});
