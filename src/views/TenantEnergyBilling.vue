<template>
  <div class="testingStore">
    <form name="testingStoreForm">
      <openwb-base-card title="Verbindung">
        <openwb-base-text-input
          title="Benutzername"
          subtype="user"
          :model-value="$store.state.examples.text5"
          @update:model-value="updateState('text5', $event)"
        >
          <template #help> Eingabefeld für Benutzernamen </template>
        </openwb-base-text-input>
        <openwb-base-text-input
          title="Passwort"
          subtype="password"
          :model-value="$store.state.examples.password1"
          @update:model-value="updateState('password1', $event)"
        >
          <template #help> Das Passwort kann per Klick auf das Auge angezeigt werden. </template>
        </openwb-base-text-input>
        <openwb-base-button-input
          title=""
          button-text="Verbinden"
          subtype="info"
        >
          <!-- <template #help> Einfacher Click-Button für Aktionen. </template> -->
        </openwb-base-button-input>
      </openwb-base-card>

      <openwb-base-card title="Status">
        <OpenwbBaseHeading> Status </OpenwbBaseHeading>
      </openwb-base-card>

      <!-- ------------------------------------------------------- -->
      <!-- ------------------------------------------------------- -->
      <openwb-base-card title="Einfache Eingabefelder">
        <openwb-base-text-input
          title="1. Text"
          :model-value="$store.state.examples.text1"
          @update:model-value="updateState('text1', $event)"
        >
          <template #help>
            Einfacher Text<br />
            Diese Komponente hat einen Slot "append" für zusätzliche Elemente, die rechts vom Eingabefeld angezeigt
            werden sollen. Das ist hier z.B. ein Farbauswahl-Element. Die Farbe kann zurückgesetzt werden, weil eine
            Standardfarbe gesetzt ist. Das ist hier z.B. rot (#ff0000).
          </template>
          <template #append>
            <openwb-base-color-picker
              class="p-1"
              :model-value="$store.state.examples.color1"
              default-color="#ff0000"
              @update:model-value="updateState('color1', $event)"
            />
          </template>
        </openwb-base-text-input>
        <openwb-base-text-input
          title="2. Text (E-Mail)"
          subtype="email"
          :model-value="$store.state.examples.text2"
          @update:model-value="updateState('text2', $event)"
        >
          <template #help> Eingabefeld für E-Mailadressen </template>
        </openwb-base-text-input>
        <openwb-base-text-input
          title="3. Text (Host)"
          subtype="host"
          :model-value="$store.state.examples.text3"
          @update:model-value="updateState('text3', $event)"
        >
          <template #help> Eingabefeld für Hosts (IP oder Namen) </template>
        </openwb-base-text-input>
        <openwb-base-text-input
          title="4. Text (URL)"
          subtype="url"
          :model-value="$store.state.examples.text4"
          @update:model-value="updateState('text4', $event)"
        >
          <template #help> Eingabefeld für URLs </template>
        </openwb-base-text-input>
        <openwb-base-text-input
          title="5. Text (User)"
          subtype="user"
          :model-value="$store.state.examples.text5"
          @update:model-value="updateState('text5', $event)"
        >
          <template #help> Eingabefeld für Benutzernamen </template>
        </openwb-base-text-input>
        <openwb-base-text-input
          title="6. Text (Time)"
          subtype="time"
          :model-value="$store.state.examples.text6"
          @update:model-value="updateState('text6', $event)"
        >
          <template #help> Eingabefeld für Zeiten </template>
        </openwb-base-text-input>
        <openwb-base-text-input
          title="7. Text (Date)"
          subtype="date"
          :model-value="$store.state.examples.text7"
          @update:model-value="updateState('text7', $event)"
        >
          <template #help> Eingabefeld für ein Datum </template>
        </openwb-base-text-input>
        <openwb-base-text-input
          title="8. Text (mit Add-Button)"
          subtype="text"
          add-button
          class="mb-2"
          :model-value="$store.state.examples.text8"
          @update:model-value="updateState('text8', $event)"
          @input:add="alert('Add button clicked!')"
        >
          <template #help> Eingabefeld mit einem Add-Button </template>
        </openwb-base-text-input>
        <hr />
        <openwb-base-number-input
          title="1. Zahl"
          :min="5"
          :max="9"
          :step="2"
          unit="kW"
          :model-value="$store.state.examples.number1"
          @update:model-value="updateState('number1', $event)"
        >
          <template #help>
            Zahl mit Einheit.<br />
            Diese Komponente hat einen Slot "append" für zusätzliche Elemente, die rechts vom Eingabefeld angezeigt
            werden sollen. Das ist hier z.B. ein Farbauswahl-Element. Ohne Standardfarbe kann die Farbe nicht
            zurückgesetzt werden.
          </template>
          <template #append>
            <openwb-base-color-picker
              class="p-1"
              :model-value="$store.state.examples.color2"
              @update:model-value="updateState('color2', $event)"
            />
          </template>
        </openwb-base-number-input>
        <openwb-base-number-input
          title="2. Zahl"
          :min="10"
          :max="32"
          :step="2"
          :model-value="$store.state.examples.number2"
          @update:model-value="updateState('number2', $event)"
        >
          <template #help> Eingabefeld für Zahlen ohne Einheit </template>
        </openwb-base-number-input>
        <openwb-base-number-input
          title="3. Zahl"
          :min="-30"
          :max="30"
          :step="0.01"
          :precision="2"
          unit="ct/kWh"
          :model-value="$store.state.examples.number3 * 100000"
          @update:model-value="updateState('number3', parseFloat(($event / 100000).toFixed(7)))"
        >
          <template #help>
            Eingabefeld für Zahlen mit Einheit und Nachkommastellen<br />
            Zusätzlich zum optionalen Parameter "step" sollte immer auch "precision" gesetzt sein, um unvermeidbare
            Darstellungsfehler zu vermeiden.<br />
            Wenn der dargestellte Wert eine andere Genauigkeit/Einheit als der Wert im Backend hat (z.B. €/Wh &lt;-&gt;
            ct/kWh), dann ist bei der Umrechnung darauf zu achten, dass es nicht erneut zu Ungenauigkeiten bei
            Dezimalzahlen kommt.
          </template>
        </openwb-base-number-input>
        <openwb-base-text-input
          title="1. Passwort"
          subtype="password"
          :model-value="$store.state.examples.password1"
          @update:model-value="updateState('password1', $event)"
        >
          <template #help> Das Passwort kann per Klick auf das Auge angezeigt werden. </template>
        </openwb-base-text-input>
        <hr />
        <openwb-base-textarea
          title="1. Textarea"
          maxlength="50"
          :model-value="$store.state.examples.textarea1"
          @update:model-value="updateState('textarea1', $event)"
        >
          <template #help> Textarea mit maximaler Länge von 50 Zeichen. </template>
        </openwb-base-textarea>
      </openwb-base-card>

      <openwb-base-submit-buttons
        form-name="testingStoreForm"
        @save="$emit('save')"
        @reset="$emit('reset')"
        @defaults="$emit('defaults')"
      />
    </form>
  </div>
</template>

<script>
import ComponentState from "../components/mixins/ComponentState.vue";

export default {
  name: "OpenwbTestingStoreView",
  mixins: [ComponentState],
  emits: ["save", "reset", "defaults"],
  data() {
    return {
      mqttTopics: [],
    };
  },
};
</script>
