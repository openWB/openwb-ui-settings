# Nissan settings source map

This map describes the current Nissan contribution in this repository.
Paths are relative to the repository root. Unrelated files are omitted;
existing shared files with narrow contribution changes are marked explicitly.
This is a source map, not a generated build or deployment inventory.

## Directory and file responsibilities

```text
openwb-ui-settings/
├── src/
│   ├── components/
│   │   ├── vehicles/nissanconnect/
│   │   │   ├── vehicle.vue              # Account form and unsaved connection test
│   │   │   └── __tests__/
│   │   │       └── vehicle.spec.js      # Synthetic component/integration tests
│   │   └── mixins/
│   │       └── ComponentState.vue       # Existing file: remove console payload logging
│   ├── views/
│   │   └── VehicleConfiguration.vue     # Existing file: remove console payload logging
│   └── App.vue                         # Existing file: remove console payload logging
├── public/modules/vehicles/nissanconnect/
│   ├── test_connection.php             # HTTP endpoint, cooldown and worker invocation
│   └── connection_test_lib.php          # Endpoint validation and process/state helpers
├── tests/nissanconnect/
│   ├── README.md                       # PHP test setup and platform requirements
│   ├── conftest.py                     # Network guards for synthetic Python tests
│   ├── connection_test_endpoint_test.py # Endpoint/helper contracts
│   ├── connection_test_http_test.py     # Isolated loopback HTTP integration checks
│   └── connection_test_state_test.py    # Private state, ownership and mode checks
├── docs/
│   ├── nissanconnect-source-map.md      # This source map and integration boundaries
│   └── nissanconnect-2.2.3.md           # Pinned compatibility build and test guide
├── scripts/
│   └── prepare-nissanconnect-2.2.3.py   # Prepare a local pinned source tree; no installation
└── .github/workflows/
    └── node.js.yml                     # Existing CI: add PHP checks and delivery comparison
```

## Integration boundaries

- `src/components/vehicles/nissanconnect/vehicle.vue` is loaded by the shared
  vehicle proxy through `<type>/vehicle.vue`; this location is an interface.
- `__tests__/vehicle.spec.js` separates synthetic tests from `vehicle.vue`
  while remaining under the configured test root (`vitest ... --root src/`).
  Relative imports and the pinned preparation overlay follow this location.
- Vite copies both PHP files from `public/modules/vehicles/nissanconnect/`
  to `modules/vehicles/nissanconnect/` in the settings build. Their established
  URLs and the source/build byte comparison in CI must stay consistent.
- The PHP endpoint calls the companion Core repository's production worker at
  `packages/modules/vehicles/nissanconnect/connection_test.py`.
  This worker is not an automated test and is not supplied by this repository.
- `tests/nissanconnect/` contains Python-driven PHP tests with synthetic input.
  Its isolated HTTP integration child uses loopback servers and a synthetic
  worker; it does not query Nissan or a wallbox.
- `scripts/prepare-nissanconnect-2.2.3.py` keeps an explicit overlay file list.
  Update that list and its guide if contribution source files move.

## Companion repository and reading guide

`openWB/core` owns the Nissan API client, native adapter, stdin worker and
Python module tests. Its directory overview is
`packages/modules/vehicles/nissanconnect/docs/source-map.md`.

See the [pinned build guide](nissanconnect-2.2.3.md) for compatibility preparation,
[PHP test README](../tests/nissanconnect/README.md) for runtime/platform checks,
and [vehicle component](../src/components/vehicles/nissanconnect/vehicle.vue)
for the actual form. Existing shared-file edits remove console payload values;
they do not introduce a new configuration or charging policy.

Keep this map synchronized with approved file moves and build/test changes.
The implemented source layout does not update an installed wallbox.
