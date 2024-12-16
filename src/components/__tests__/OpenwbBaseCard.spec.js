import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OpenwbBaseCard from "../OpenwbBaseCard.vue";

describe("Card.vue", () => {
  it("adds class props.subtype when passed", () => {
    const title = "My Title";
    const subtype = "info";
    const wrapper = mount(OpenwbBaseCard, {
      props: { subtype, title },
    });
    const card = wrapper.find("div.card");
    expect(card.classes()).toContain("border-" + subtype);
    const cardHeader = wrapper.find("div.card-header");
    expect(cardHeader.classes()).toContain("bg-" + subtype);
  });
  it("render title when no header slot is passed", () => {
    const title = "My Title";
    const wrapper = mount(OpenwbBaseCard, {
      props: {
        title,
      },
    });
    const cardHeader = wrapper.find("div.card-header");
    expect(cardHeader.html()).toContain(title);
  });
  it("render header slot when passed", () => {
    const slotContent = "<span>My Title Slot</span>";
    const wrapper = mount(OpenwbBaseCard, {
      slots: {
        header: slotContent,
      },
    });
    const cardHeader = wrapper.find("div.card-header");
    expect(cardHeader.html()).toContain(slotContent);
  });
  it("render default slot when passed", () => {
    const slotContent = "<span>Default slot content.</span>";
    const wrapper = mount(OpenwbBaseCard, {
      slots: {
        default: slotContent,
      },
    });
    const card = wrapper.find("div.card");
    expect(card.html()).toContain(slotContent);
  });
  it("render marker when collapsible", () => {
    const title = "My Title";
    const collapsible = true;
    const wrapper = mount(OpenwbBaseCard, {
      props: {
        title,
        collapsible,
      },
    });
    const cardHeader = wrapper.find("div.card-header");
    expect(cardHeader.html()).toContain("chevron-down");
  });
  it("do not render card body when collapsed", async () => {
    const title = "My Title";
    const collapsible = true;
    const collapsed = true;
    const wrapper = mount(OpenwbBaseCard, {
      props: {
        title,
        collapsible,
        collapsed,
      },
    });
    const card = wrapper.find("div.card");
    expect(card.html()).not.toContain("card-body");
    // now click header to expand
    const cardHeader = wrapper.find("div.card-header");
    await cardHeader.trigger("click");
    expect(card.html()).toContain("card-body");
  });
  it("render actions slot when passed", () => {
    const title = "My Title";
    const slotContent = "<span>Actions slot content.</span>";
    const wrapper = mount(OpenwbBaseCard, {
      props: { title },
      slots: {
        actions: slotContent,
      },
    });
    const cardHeaderActions = wrapper.find("span.card-actions");
    expect(cardHeaderActions.html()).toContain(slotContent);
  });
  it("render footer slot when passed", () => {
    const slotContent = "<span>Footer slot content.</span>";
    const wrapper = mount(OpenwbBaseCard, {
      slots: {
        footer: slotContent,
      },
    });
    const cardFooter = wrapper.find("div.card-footer");
    expect(cardFooter.html()).toContain(slotContent);
  });
});
