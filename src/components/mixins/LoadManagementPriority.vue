<script>
// Shared helpers to read an element's rank from the load management priority
// list (openWB/counter/get/loadmanagement_prios).
const LOADMANAGEMENT_PRIOS_TOPIC = "openWB/counter/get/loadmanagement_prios";

export default {
  name: "LoadManagementPriority",
  computed: {
    loadManagementPriorityList() {
      const list = this.$store.state.mqtt[LOADMANAGEMENT_PRIOS_TOPIC];
      return Array.isArray(list) ? list : [];
    },
  },
  mounted() {
    this.$root.doSubscribe([LOADMANAGEMENT_PRIOS_TOPIC]);
  },
  unmounted() {
    this.$root.doUnsubscribe([LOADMANAGEMENT_PRIOS_TOPIC]);
  },
  methods: {
    // matches an entry against the requested type/id
    matchesPriorityEntry(entry, type, id) {
      return entry.type === type && String(entry.id) === String(id);
    },
    loadManagementPriority(type, id) {
      const list = this.loadManagementPriorityList;
      for (let rank = 0; rank < list.length; rank++) {
        const entry = list[rank];
        if (entry.type === "group") {
          if ((entry.children ?? []).some((child) => this.matchesPriorityEntry(child, type, id))) {
            return rank + 1;
          }
        } else if (this.matchesPriorityEntry(entry, type, id)) {
          return rank + 1;
        }
      }
      return null;
    },
    loadManagementPriorityShared(type, id) {
      const list = this.loadManagementPriorityList;
      for (const entry of list) {
        if (entry.type === "group") {
          const children = entry.children ?? [];
          if (children.some((child) => this.matchesPriorityEntry(child, type, id))) {
            return children.length > 1;
          }
        }
      }
      return false;
    },
  },
};
</script>
