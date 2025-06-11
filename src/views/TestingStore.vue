<template>
  <div class="testingStore">
    <form name="testingStoreForm">
      <openwb-base-card title="Elemente mit BaseSettingElement">
        <OpenwbBaseHeading> Basiselement </OpenwbBaseHeading>
        <OpenwbBaseSettingElement>
          <template #title>
            <span style="font-style: italic">
              Styled
              <span style="font-weight: bold">Title</span> Slot
            </span>
          </template>
          <template #help>
            Basis-Element für alle weiteren Elemente. Das ist ein
            <a href="test">Link</a>.
          </template>
        </OpenwbBaseSettingElement>
        <OpenwbBaseHeading> Abgeleitete Elemente </OpenwbBaseHeading>
        <openwb-base-button-input
          title="Button Input"
          button-text="Klick mich"
          subtype="info"
        >
          <template #help> Einfacher Click-Button für Aktionen. </template>
        </openwb-base-button-input>
        <openwb-base-button-group-input
          title="Button Group Input"
          :buttons="[
            { buttonValue: 1, text: 'Eins' },
            { buttonValue: 2, text: 'Zwei' },
          ]"
          :model-value="$store.state.examples.buttonGroup1"
          @update:model-value="updateState('buttonGroup1', $event)"
        >
          <template #help>
            Button-Group Element zur Auswahl weniger Optionen. Bei vielen Optionen besser ein Dropdown verwenden.
            <a href="test">Link</a>.
          </template>
        </openwb-base-button-group-input>
      </openwb-base-card>
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
              disabled
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

      <openwb-base-card title="Spezielle Elemente">
        <openwb-base-range-input
          title="1. Range"
          :min="6"
          :max="32"
          :step="1"
          unit="A"
          :model-value="$store.state.examples.range1"
          @update:model-value="updateState('range1', $event)"
        >
          <template #help> Range ohne spezielle Labels </template>
        </openwb-base-range-input>
        <openwb-base-range-input
          title="2. Range"
          :min="0"
          :max="11"
          :step="1"
          unit="A"
          :labels="[
            { label: 'Aus', value: 0 },
            { label: 6, value: 6 },
            { label: 7, value: 7 },
            { label: 8, value: 8 },
            { label: 9, value: 9 },
            { label: 10, value: 10 },
            { label: 11, value: 11 },
            { label: 12, value: 12 },
            { label: 13, value: 13 },
            { label: 14, value: 14 },
            { label: 15, value: 15 },
            { label: 16, value: 16 },
          ]"
          :model-value="$store.state.examples.range2"
          @update:model-value="updateState('range2', $event)"
        >
          <template #help> Range mit speziellen Labels </template>
        </openwb-base-range-input>
        <hr />
        <openwb-base-select-input
          title="1. Select"
          not-selected="Bitte auswählen"
          :options="[
            { value: 1, text: 'Eins' },
            { value: 2, text: 'Zwei' },
          ]"
          :model-value="$store.state.examples.select1"
          @update:model-value="updateState('select1', $event)"
        >
          <template #help> Select mit einfachen Optionen </template>
        </openwb-base-select-input>
        <openwb-base-select-input
          title="2. Select"
          :groups="[
            {
              label: 'Gruppe 1 (Number)',
              options: [
                { value: 1, text: 'Eins' },
                { value: 2, text: 'Zwei' },
              ],
            },
            {
              label: 'Gruppe 2 (String)',
              options: [
                { value: 'three', text: 'Drei' },
                { value: 'four', text: 'Vier' },
              ],
            },
          ]"
          not-selected="Bitte auswählen"
          :add-button="true"
          :model-value="$store.state.examples.select2"
          @update:model-value="updateState('select2', $event)"
          @input:add="alert('add button pressed')"
        >
          <template #help> Select mit Gruppen und Add-Button. </template>
        </openwb-base-select-input>
        <hr />
        <openwb-base-button-group-input
          title="1. Button-Group"
          :buttons="[
            { buttonValue: 1, text: 'Eins' },
            { buttonValue: 2, text: 'Zwei' },
          ]"
          :model-value="$store.state.examples.buttonGroup1"
          @update:model-value="updateState('buttonGroup1', $event)"
        >
          <template #help> Hilfetext </template>
        </openwb-base-button-group-input>
        <openwb-base-heading>
          Select Element ohne Label:
          <openwb-base-select-input
            class="mb-1"
            not-selected="Bitte auswählen"
            :options="[
              { value: 1, text: 'Eins' },
              { value: 2, text: 'Zwei' },
            ]"
            :model-value="$store.state.examples.select1"
            @update:model-value="updateState('select1', $event)"
          />
        </openwb-base-heading>
        <hr />
        <openwb-base-checkbox-input
          title="1. Checkbox"
          :model-value="$store.state.examples.checkbox1"
          @update:model-value="updateState('checkbox1', $event)"
        >
          <template #help> Hilfetext </template>
        </openwb-base-checkbox-input>
      </openwb-base-card>

      <openwb-base-card title="JSON Gruppe">
        <openwb-base-text-input
          title="JSON 1"
          subtype="json"
          :model-value="$store.state.examples.json1"
          @update:model-value="updateState('json1', $event)"
        >
          <template #help> JSON Objekt </template>
        </openwb-base-text-input>
        <openwb-base-text-input
          title="JSON 1 Text"
          :model-value="$store.state.examples.json1.text"
          @update:model-value="updateState('json1', $event, 'text')"
        >
          <template #help> Text im JSON Objekt </template>
        </openwb-base-text-input>
        <openwb-base-number-input
          title="JSON 1 Zahl"
          :model-value="$store.state.examples.json1.number"
          @update:model-value="updateState('json1', $event, 'number')"
        >
          <template #help> Zahl im JSON Objekt </template>
        </openwb-base-number-input>
        <openwb-base-array-input
          title="Tag Array"
          :model-value="$store.state.examples.tags"
          @update:model-value="updateState('tags', $event)"
        >
          <template #help>
            <pre>{{ JSON.stringify($store.state.examples.tags, undefined, 2) }}</pre>
          </template>
        </openwb-base-array-input>
      </openwb-base-card>

      <openwb-base-card title="Meldungen">
        <template #header>
          <span style="text-decoration: underline; font-style: italic">
            Styled
            <span style="font-weight: initial">Header</span> Slot
          </span>
        </template>
        <openwb-base-heading>
          Das ist eine Überschrift
          <template #help>
            Es sind auch Hilfetexte im #help Slot möglich.
            <a href="test">Link</a>
          </template>
        </openwb-base-heading>
        <openwb-base-alert>
          Meldung ohne speziellen Subtype.
          <openwb-base-copy-to-clipboard>Kopiere mich!</openwb-base-copy-to-clipboard>
        </openwb-base-alert>
        <openwb-base-alert subtype="info"> Infomeldung </openwb-base-alert>
        <openwb-base-alert subtype="warning"> Warnmeldung </openwb-base-alert>
        <openwb-base-alert subtype="danger"> Fehlermeldung </openwb-base-alert>
      </openwb-base-card>

      <openwb-base-card title="Listen">
        <!-- ToDo: Fix: nested lists bypass store commits! -->
        <sortable-list
          v-model="$store.state.examples.hierarchy1"
          title="Liste 1"
          :labels="$store.state.examples.hierarchy1Labels"
        >
          <template #help>
            <pre>{{ JSON.stringify($store.state.examples.hierarchy1, undefined, 2) }}</pre>
          </template>
        </sortable-list>
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
import SortableList from "../components/OpenwbSortableList.vue";

export default {
  name: "OpenwbTestingStoreView",
  components: {
    SortableList,
  },
  mixins: [ComponentState],
  emits: ["save", "reset", "defaults"],
  data() {
    return {
      mqttTopicsToSubscribe: [],
    };
  },
};
</script>
