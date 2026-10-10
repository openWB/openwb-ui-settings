import { mount, flushPromises } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent } from "vue";
import Vehicle from "../vehicle.vue";
import Proxy from "../../OpenwbVehicleProxy.vue";
import TextInput from "../../../OpenwbBaseTextInput.vue";
import VehicleConfiguration from "../../../../views/VehicleConfiguration.vue";
import ComponentState from "../../../mixins/ComponentState.vue";
import App from "../../../../App.vue";
import store from "../../../../store";

// The harness borrows selection/save methods, not the unrelated charge-plan editors.
// Avoid compiling their absolute /src imports when CI sets its test root to src/.
vi.mock("../../ChargeTemplateScheduledChargingPlan.vue", () => ({ default: {} }));
vi.mock("../../ChargeTemplateTimeChargingPlan.vue", () => ({ default: {} }));

// App is imported for its save method only; no application or MQTT client starts.
vi.mock("mqtt", () => ({
  default: {
    connect: () => {
      throw new Error("Network use is forbidden in settings tests");
    },
  },
}));

const topic = "openWB/vehicle/7/soc_module/config";
const defaults = () => ({
  name: "Nissan – MyNISSAN EU (experimental)",
  type: "nissanconnect",
  configuration: { user_id: null, password: null, vin: null },
});
const global = {
  components: { "openwb-base-text-input": TextInput },
  stubs: {
    "openwb-base-alert": { template: "<div><slot /></div>" },
    "openwb-base-heading": { template: "<h2><slot /></h2>" },
    "openwb-base-tooltip": { template: "<span><slot /></span>" },
  },
};
let wrapper;

beforeEach(() => {
  vi.spyOn(console, "debug").mockImplementation(() => {});
  const denyNetwork = () => {
    throw new Error("Network use is forbidden in settings tests");
  };
  vi.stubGlobal("fetch", denyNetwork);
  vi.stubGlobal("WebSocket", denyNetwork);
  vi.stubGlobal("XMLHttpRequest", denyNetwork);
  store.replaceState({ mqtt: {}, mqttSubscriptions: {}, local: { savingData: false } });
});

afterEach(() => {
  wrapper?.unmount();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("NissanConnect settings", () => {
  it("requires account fields, permits an empty VIN and masks the real password input", async () => {
    wrapper = mount(Vehicle, { props: { vehicleId: 7, vehicle: defaults() }, global });
    const user = wrapper.get('input[aria-label="MyNISSAN username"]');
    const password = wrapper.get('input[aria-label="MyNISSAN password"]');
    const vin = wrapper.get('input[aria-label="Vehicle identification number (VIN)"]');
    expect(user.element.checkValidity()).toBe(false);
    expect(password.element.checkValidity()).toBe(false);
    expect(vin.element.checkValidity()).toBe(true);
    expect(user.attributes("autocomplete")).toBe("username");
    expect(password.attributes("autocomplete")).toBe("current-password");
    expect(password.attributes("type")).toBe("password");
    await user.setValue("synthetic@example.invalid");
    await password.setValue("synthetic-password");
    await vin.setValue("SJNFAAZE1U0000001");
    await vin.setValue("");
    expect(wrapper.emitted("update:configuration")).toEqual([
      [{ value: "synthetic@example.invalid", object: "configuration.user_id" }],
      [{ value: "synthetic-password", object: "configuration.password" }],
      [{ value: "SJNFAAZE1U0000001", object: "configuration.vin" }],
      [{ value: null, object: "configuration.vin" }],
    ]);
    expect(wrapper.find("pre").exists()).toBe(false);
    expect(wrapper.text()).not.toContain("synthetic-password");
  });

  it("loads the page through the real asynchronous vehicle proxy", async () => {
    wrapper = mount(Proxy, { props: { vehicleId: 7, vehicle: defaults() }, global });
    await vi.waitFor(() => expect(wrapper.find(".vehicle-soc-nissanconnect").exists()).toBe(true));
    await wrapper.get('input[type="password"]').setValue("synthetic-changed");
    expect(wrapper.emitted("update:configuration")).toEqual([
      [{ value: "synthetic-changed", object: "configuration.password" }],
    ]);
    expect(wrapper.find(".vehicle-soc-fallback").exists()).toBe(false);
    expect(wrapper.find("pre").exists()).toBe(false);
  });

  it("selects Core defaults and saves the edited configuration through the existing openWB path", async () => {
    const descriptor = { value: "nissanconnect", text: defaults().name, defaults: defaults() };
    store.state.mqtt["openWB/system/configurable/soc_modules"] = [descriptor];
    store.state.mqtt[topic] = { type: "manual", configuration: {} };
    const publish = vi.fn();
    const Harness = defineComponent({
      components: { Proxy },
      computed: {
        socModuleList: VehicleConfiguration.computed.socModuleList,
        vehicle() {
          return this.$store.state.mqtt[topic];
        },
      },
      methods: {
        updateState: ComponentState.methods.updateState,
        getSocDefaultConfiguration: VehicleConfiguration.methods.getSocDefaultConfiguration,
        updateSelectedSocModule: VehicleConfiguration.methods.updateSelectedSocModule,
        updateConfiguration: VehicleConfiguration.methods.updateConfiguration,
        saveValues: App.methods.saveValues,
        doPublish: publish,
        update(event) {
          this.updateConfiguration(topic, event);
        },
        save() {
          return this.saveValues([topic]);
        },
      },
      template: `<form>
        <select aria-label="SoC module" @change="updateSelectedSocModule(7, $event.target.value)">
          <option value="manual">Manual</option><option value="nissanconnect">MyNISSAN EU</option>
        </select>
        <Proxy v-if="vehicle.type === 'nissanconnect'" :vehicle-id="7" :vehicle="vehicle" @update:configuration="update" />
      </form>`,
    });
    wrapper = mount(Harness, { global: { ...global, plugins: [store] } });
    await wrapper.get("select").setValue("nissanconnect");
    await vi.waitFor(() => expect(wrapper.find(".vehicle-soc-nissanconnect").exists()).toBe(true));
    expect(store.state.mqtt[topic]).toEqual(defaults());
    await wrapper.get('input[aria-label="MyNISSAN username"]').setValue("synthetic@example.invalid");
    await flushPromises();
    await wrapper.get('input[aria-label="MyNISSAN password"]').setValue("synthetic-password");
    await flushPromises();
    expect(wrapper.get("form").element.checkValidity()).toBe(true);
    expect(publish).not.toHaveBeenCalled();
    await wrapper.vm.save();
    expect(publish).toHaveBeenCalledExactlyOnceWith("openWB/set/vehicle/7/soc_module/config", {
      ...defaults(),
      configuration: { user_id: "synthetic@example.invalid", password: "synthetic-password", vin: null },
    });
    expect(store.state.local.savingData).toBe(false);
    expect(JSON.stringify(console.debug.mock.calls)).not.toContain("synthetic-password");
    expect(JSON.stringify(console.debug.mock.calls)).not.toContain("synthetic@example.invalid");
    expect(descriptor.defaults).toEqual(defaults());
    expect(wrapper.get('input[type="password"]').element.value).toBe("synthetic-password");
  });
});

const enteredVehicle = () => ({
  ...defaults(),
  configuration: {
    user_id: "synthetic@example.invalid",
    password: "synthetic-password",
    vin: null,
  },
});
const successBody = () => ({
  success: true,
  code: "success",
  retry_after_seconds: 300,
  account_retry_after_seconds: 300,
  provider_retry_after_seconds: 0,
  query: {
    outcome: "success",
    http_requests: 8,
    soc: 0,
    range_km: null,
    request_started_at: "2022-01-02T00:00:00+00:00",
    completed_at: "2022-01-02T00:00:03+00:00",
    measurement_at: "2022-01-01T00:00:00+00:00",
    password: "synthetic-server-secret",
  },
});

describe("Nissan connection test", () => {
  it("sends current input once and shows allowlisted data without saving", async () => {
    const request = vi.fn().mockResolvedValue({ ok: true, json: async () => successBody() });
    vi.stubGlobal("fetch", request);
    wrapper = mount(Vehicle, { props: { vehicleId: 7, vehicle: enteredVehicle() }, global });
    await wrapper.get("button").trigger("click");
    await flushPromises();
    expect(request).toHaveBeenCalledTimes(1);
    const [url, options] = request.mock.calls[0];
    expect(url).toBe("/openWB/web/settings/modules/vehicles/nissanconnect/test_connection.php");
    expect(options.method).toBe("POST");
    expect(options.mode).toBe("same-origin");
    expect(JSON.parse(options.body)).toEqual(enteredVehicle().configuration);
    expect(wrapper.get('[role="status"]').text()).toContain("0 %");
    expect(wrapper.text()).toContain("Not available");
    expect(wrapper.text()).toContain("Battery measurement time");
    expect(wrapper.get('[aria-label="Nissan request count"] dd').text()).toBe("8");
    expect(wrapper.text()).not.toContain("synthetic-server-secret");
    expect(wrapper.emitted("update:configuration")).toBeUndefined();
    expect(wrapper.get("button").element.disabled).toBe(true);
    expect(JSON.stringify(console.debug.mock.calls)).not.toContain("synthetic-password");
  });

  it("prevents duplicate requests and ignores replies after edited input", async () => {
    let finish;
    const request = vi.fn(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    vi.stubGlobal("fetch", request);
    wrapper = mount(Vehicle, { props: { vehicleId: 7, vehicle: enteredVehicle() }, global });
    await wrapper.get("button").trigger("click");
    await wrapper.vm.testConnection();
    expect(request).toHaveBeenCalledTimes(1);
    await wrapper.setProps({
      vehicle: {
        ...enteredVehicle(),
        configuration: {
          ...enteredVehicle().configuration,
          password: "synthetic-new-password",
        },
      },
    });
    finish({ ok: true, json: async () => successBody() });
    await flushPromises();
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
    expect(wrapper.find('[aria-label="Nissan request count"]').exists()).toBe(false);
    expect(request.mock.calls[0][1].signal.aborted).toBe(false);
    expect(wrapper.get("button").element.disabled).toBe(true);
  });

  it.each(["authentication_failed", "cooldown", "unexpected"])("shows bounded errors for %s", async (code) => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          success: false,
          code,
          message: "synthetic-private-response",
          account_retry_after_seconds: code === "cooldown" ? 300 : 0,
          provider_retry_after_seconds: 0,
        }),
      }),
    );
    wrapper = mount(Vehicle, { props: { vehicleId: 7, vehicle: enteredVehicle() }, global });
    await wrapper.get("button").trigger("click");
    await flushPromises();
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
    expect(wrapper.get('[role="alert"]').text()).not.toContain("synthetic-private-response");
    expect(wrapper.get("button").element.disabled).toBe(code === "cooldown");
  });
});

describe("Nissan request count", () => {
  it.each([0, 2])("shows %s attempted requests even when the test fails", async (httpRequestCount) => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: false,
          code: "authentication_failed",
          query: { http_requests: httpRequestCount },
        }),
      }),
    );
    wrapper = mount(Vehicle, { props: { vehicleId: 7, vehicle: enteredVehicle() }, global });
    await wrapper.get("button").trigger("click");
    await flushPromises();
    expect(wrapper.get('[aria-label="Nissan request count"] dd').text()).toBe(String(httpRequestCount));
    expect(wrapper.get('[role="alert"]').text()).toContain("Nissan rejected the login");
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
  });

  it.each([undefined, null, -1, 1.5, "8", true, Infinity, Number.MAX_SAFE_INTEGER + 1])(
    "shows an unavailable count without discarding successful battery data: %s",
    async (httpRequestCount) => {
      const body = successBody();
      body.query.http_requests = httpRequestCount;
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => body }));
      wrapper = mount(Vehicle, { props: { vehicleId: 7, vehicle: enteredVehicle() }, global });
      await wrapper.get("button").trigger("click");
      await flushPromises();
      expect(wrapper.get('[aria-label="Nissan request count"] dd').text()).toBe("Not available");
      expect(wrapper.get('[role="status"]').text()).toContain("0 %");
      expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    },
  );

  it("clears counts on input changes and replaces them for each test instead of accumulating", async () => {
    const body = successBody();
    body.account_retry_after_seconds = 0;
    const request = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => body })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false, code: "authentication_failed", query: { http_requests: 2 } }),
      })
      .mockRejectedValueOnce(new Error("synthetic-network-failure"));
    vi.stubGlobal("fetch", request);
    wrapper = mount(Vehicle, { props: { vehicleId: 7, vehicle: enteredVehicle() }, global });
    expect(wrapper.find('[aria-label="Nissan request count"]').exists()).toBe(false);
    await wrapper.get("button").trigger("click");
    await flushPromises();
    expect(wrapper.get('[aria-label="Nissan request count"] dd').text()).toBe("8");
    await wrapper.setProps({
      vehicle: {
        ...enteredVehicle(),
        configuration: { ...enteredVehicle().configuration, user_id: "other@example.invalid" },
      },
    });
    expect(wrapper.find('[aria-label="Nissan request count"]').exists()).toBe(false);
    await wrapper.get("button").trigger("click");
    await flushPromises();
    expect(wrapper.get('[aria-label="Nissan request count"] dd').text()).toBe("2");
    await wrapper.get("button").trigger("click");
    await flushPromises();
    expect(wrapper.get('[aria-label="Nissan request count"] dd').text()).toBe("Not available");
    expect(request).toHaveBeenCalledTimes(3);
    expect(wrapper.emitted("update:configuration")).toBeUndefined();
  });
});

describe("Nissan account cooldowns", () => {
  const account = (name, password = "synthetic-password", vin = null) => ({
    ...enteredVehicle(),
    configuration: { user_id: name, password, vin },
  });

  it("allows account B, retains account A across password/VIN changes, and expires", async () => {
    const now = vi.spyOn(Date, "now").mockReturnValue(1000000);
    const request = vi.fn().mockResolvedValue({ ok: true, json: async () => successBody() });
    vi.stubGlobal("fetch", request);
    wrapper = mount(Vehicle, { props: { vehicleId: 7, vehicle: account("a@example.invalid") }, global });
    await wrapper.get("button").trigger("click");
    await flushPromises();
    expect(wrapper.vm.canTest).toBe(false);
    await wrapper.setProps({ vehicle: account("b@example.invalid") });
    expect(wrapper.vm.canTest).toBe(true);
    await wrapper.setProps({ vehicle: account(" A@example.invalid ", "corrected", "SJNFAAZE1U0000001") });
    expect(wrapper.vm.cooldownSeconds).toBe(300);
    now.mockReturnValue(1300000);
    await wrapper.setData({ nowMs: Date.now() });
    expect(wrapper.vm.canTest).toBe(true);
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("retains a completed earlier account's cooldown after switching during its request", async () => {
    let finish;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise((resolve) => {
            finish = resolve;
          }),
      ),
    );
    wrapper = mount(Vehicle, { props: { vehicleId: 7, vehicle: account("a@example.invalid") }, global });
    await wrapper.get("button").trigger("click");
    await wrapper.setProps({ vehicle: account("b@example.invalid") });
    expect(wrapper.vm.canTest).toBe(false);
    finish({ ok: true, json: async () => successBody() });
    await flushPromises();
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
    expect(wrapper.vm.canTest).toBe(true);
    await wrapper.setProps({ vehicle: account("a@example.invalid") });
    expect(wrapper.vm.canTest).toBe(false);
  });

  it("allows a corrected password immediately after failure", async () => {
    const request = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: false,
        code: "authentication_failed",
        account_retry_after_seconds: 0,
        provider_retry_after_seconds: 0,
      }),
    });
    vi.stubGlobal("fetch", request);
    wrapper = mount(Vehicle, { props: { vehicleId: 7, vehicle: account("a@example.invalid") }, global });
    await wrapper.get("button").trigger("click");
    await flushPromises();
    await wrapper.setProps({ vehicle: account("a@example.invalid", "corrected") });
    expect(wrapper.vm.canTest).toBe(true);
    await wrapper.get("button").trigger("click");
    await flushPromises();
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("keeps a provider pause across account changes", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          success: false,
          code: "provider_delay",
          account_retry_after_seconds: 0,
          provider_retry_after_seconds: 900,
        }),
      }),
    );
    wrapper = mount(Vehicle, { props: { vehicleId: 7, vehicle: account("a@example.invalid") }, global });
    await wrapper.get("button").trigger("click");
    await flushPromises();
    await wrapper.setProps({ vehicle: account("b@example.invalid") });
    expect(wrapper.vm.canTest).toBe(false);
    expect(wrapper.vm.cooldownSeconds).toBe(900);
    expect(wrapper.text()).toContain("Nissan requires a pause");
  });
});

describe("Nissan connection transport failures", () => {
  it.each(["network", "json"])("handles %s failures without exposing exception content", async (kind) => {
    const error = new Error("synthetic-private-exception");
    vi.stubGlobal(
      "fetch",
      kind === "network"
        ? vi.fn().mockRejectedValue(error)
        : vi.fn().mockResolvedValue({
            ok: true,
            json: async () => {
              throw error;
            },
          }),
    );
    wrapper = mount(Vehicle, { props: { vehicleId: 7, vehicle: enteredVehicle() }, global });
    await wrapper.get("button").trigger("click");
    await flushPromises();
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
    expect(wrapper.get('[role="alert"]').text()).not.toContain("synthetic-private-exception");
    expect(wrapper.get('[aria-label="Nissan request count"] dd').text()).toBe("Not available");
    expect(wrapper.get("button").element.disabled).toBe(false);
  });

  it("rejects an incomplete success result", async () => {
    const body = successBody();
    body.query.measurement_at = null;
    body.account_retry_after_seconds = 0;
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => body }));
    wrapper = mount(Vehicle, { props: { vehicleId: 7, vehicle: enteredVehicle() }, global });
    await wrapper.get("button").trigger("click");
    await flushPromises();
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
    expect(wrapper.get('[role="alert"]').text()).toContain("invalid result");
    expect(wrapper.text()).not.toContain("synthetic-server-secret");
  });

  it("handles a missing response at the browser deadline", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval", "Date"] });
    let signal;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (url, options) =>
          new Promise((resolve, reject) => {
            signal = options.signal;
            signal.addEventListener("abort", () => reject(new Error("synthetic-private-abort")), { once: true });
          }),
      ),
    );
    wrapper = mount(Vehicle, { props: { vehicleId: 7, vehicle: enteredVehicle() }, global });
    await wrapper.get("button").trigger("click");
    await vi.advanceTimersByTimeAsync(74999);
    expect(signal.aborted).toBe(false);
    expect(wrapper.get("button").element.disabled).toBe(true);
    await vi.advanceTimersByTimeAsync(1);
    await flushPromises();
    expect(signal.aborted).toBe(true);
    expect(wrapper.get("button").element.disabled).toBe(false);
    expect(wrapper.get('[role="alert"]').text()).toContain("timed out");
    expect(wrapper.get('[aria-label="Nissan request count"] dd').text()).toBe("Not available");
    expect(wrapper.text()).not.toContain("synthetic-private-abort");
    expect(vi.getTimerCount()).toBe(1);
  });
});

describe("Nissan odometer", () => {
  it.each([0, 12345.6])("displays an optional odometer of %s km with its timestamp limitation", async (odometer) => {
    const body = successBody();
    body.query.odometer_km = odometer;
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => body }));
    wrapper = mount(Vehicle, { props: { vehicleId: 7, vehicle: enteredVehicle() }, global });
    await wrapper.get("button").trigger("click");
    await flushPromises();
    const result = wrapper.get('[role="status"]');
    expect(result.text()).toContain(`${odometer} km`);
    expect(result.text()).toContain("no separate measurement timestamp");
    expect(wrapper.vm.result.odometer_km).toBe(odometer);
    expect(wrapper.emitted("update:configuration")).toBeUndefined();
  });

  it.each([undefined, null, -1, "12345", true, Infinity])(
    "keeps the battery result when odometer is unavailable or invalid: %s",
    async (odometer) => {
      const body = successBody();
      body.query.odometer_km = odometer;
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => body }));
      wrapper = mount(Vehicle, { props: { vehicleId: 7, vehicle: enteredVehicle() }, global });
      await wrapper.get("button").trigger("click");
      await flushPromises();
      expect(wrapper.get('[role="status"]').text()).toContain("0 %");
      expect(wrapper.vm.result.odometer_km).toBeNull();
      expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    },
  );
});
