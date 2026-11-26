// Use recorded fault states, not rounded energy values, to identify unreliable data.
// A fault does not by itself prove a disconnected or defective device.
export const energyGroups = ["pv", "bat", "counter", "cp", "consumer", "hc", "sh"];

export function logMessage(log) {
  return typeof log?.message === "string" ? log.message.trim() : "";
}

export function analyseLogQuality(log, accessible = () => true) {
  const entries = Array.isArray(log?.entries) ? log.entries : [];
  const steps = entries
    .slice(1)
    .map((entry, index) => entry?.timestamp - entries[index]?.timestamp)
    .filter((step) => Number.isFinite(step) && step > 0)
    .sort((a, b) => a - b);
  // Infer the normal cadence only with enough observations; do not assume five minutes.
  const cadence = steps.length >= 3 ? steps[Math.floor(steps.length / 2)] : undefined;
  const components = new Map();
  const gaps = [];
  let messagesVisible = true;

  entries.forEach((entry, index) => {
    const previous = entries[index - 1];
    const step = entry?.timestamp - previous?.timestamp;
    const gap = cadence !== undefined && step > cadence * 1.5;
    if (gap) {
      gaps.push({ from: previous.date, to: entry.date });
    }
    energyGroups.forEach((group) => {
      const modules = entry?.[group] || {};
      const faulty = Object.keys(modules).filter((key) => modules[key]?.fault_state === 2);
      Object.keys(modules).forEach((key) => {
        if (!accessible(group, key)) {
          messagesVisible = false;
        }
      });
      faulty.forEach((key) => {
        // Prefer the named devices over their duplicate aggregate fault.
        if ((key === "all" && faulty.some((name) => name !== "all")) || !accessible(group, key)) {
          return;
        }
        const id = `${group}.${key}`;
        if (!components.has(id)) {
          components.set(id, {
            id,
            group,
            key,
            name: log?.names?.[key] || key,
            ranges: [],
          });
        }
        const ranges = components.get(id).ranges;
        const last = ranges.at(-1);
        if (last && last.index === index - 1 && !gap && Number.isFinite(step) && step > 0) {
          last.to = entry.date;
          last.index = index;
        } else {
          ranges.push({ from: entry.date, to: entry.date, index });
        }
      });
    });
  });
  return {
    components: [...components.values()].map((component) => ({
      ...component,
      ranges: component.ranges.map(({ from, to }) => ({ from, to })),
    })),
    gaps,
    messagesVisible,
  };
}
