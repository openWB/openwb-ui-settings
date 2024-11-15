import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";

import { nodePolyfills } from "vite-plugin-node-polyfills";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

export default defineConfig(({ command, mode }) => {
  var myConfiguration = {
    plugins: [Vue()],
    base: "/openWB/web/settings/",
  };
  if (command === "serve") {
    if (mode === "test") {
      myConfiguration["test"] = {
        globals: true,
        environment: "jsdom",
      };
    } else {
      myConfiguration.plugins.push(
        nodePolyfills({
          // Whether to polyfill `node:` protocol imports.
          protocolImports: true,
        }),
      );
      myConfiguration.server = {
        proxy: {
          "/ws": {
            target: "ws://localhost:9001",
            ws: true,
          },
        },
      };
    }
  } else {
    myConfiguration.plugins.push(
      nodePolyfills({
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),
    );
    myConfiguration.build = {
      rollupOptions: {
        plugins: [rollupNodePolyFill()],
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("fortawesome")) {
                return "vendor-fortawesome";
              }
              if (id.includes("bootstrap")) {
                return "vendor-bootstrap";
              }
              if (id.includes("chart.js") || id.includes("chartjs")) {
                return "vendor-chartjs";
              }
              // if (id.includes("mqtt")) {
              //   return "vendor-mqtt";
              // }
              if (id.includes("axios")) {
                return "vendor-axios";
              }
              if (id.includes("luxon")) {
                return "vendor-luxon";
              }
              // if (id.includes("lodash")) {
              //   return "vendor-lodash";
              // }
              if (id.includes("jquery")) {
                return "vendor-jquery";
              }
              if (id.includes("sortablejs")) {
                return "vendor-sortablejs";
              }
              // if (id.includes("browserify")) {
              //   return "vendor-browserify";
              // }
              // if (id.includes("node-stdlib-browser")) {
              //   return "vendor-node-stdlib-browser";
              // }
              // if (id.includes("readable-stream")) {
              //   return "vendor-readable-stream";
              // }
              // if (id.includes("@vue")) {
              //   return "vendor-vue";
              // }
              // console.log("vendor chunk: " + id);
              return "vendor";
            }
          },
        },
      },
    };
  }
  return myConfiguration;
});
