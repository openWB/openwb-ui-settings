# Reproduce the Nissan settings overlay for openWB 2.2.3

This optional development guide prepares the Nissan settings contribution against
the source used for the 2.2.3 settings UI. It does not install on a wallbox.
For the current contribution layout, see the [source map](nissanconnect-source-map.md).

## Pinned inputs

| Input | Revision |
| --- | --- |
| Core 2.2.3 target | `3ced7f9cef3c70980ee1fab670f0d0717d1809ca` |
| Settings base, `Brett-S-OWB/openwb-ui-settings_BS_folk` | `e8de268fa25f7efca2b5ffc005a757a2f36b530f` |
| Core's corresponding settings build record | `cfac8180bbbcf25c29fffa75969b926baedb3e2b` |

The preparer uses that fixed settings base, rather than current `main`, and
overlays the working copies of the Nissan component, its `__tests__` file and
both PHP sources. It also removes payload values from three existing console
debug statements in `App.vue`, `ComponentState.vue` and `VehicleConfiguration.vue`.
No dependency versions are changed. Working-copy hashes are recorded even when
the overlay has uncommitted edits.

## Prepare, test and build locally

Use a development computer with Git, Python 3.9+, Node.js and npm. Node 24.19.0
was used for recorded local builds. Start in this settings repository and make
the pinned public commit available if it is not already present:

```sh
git fetch --no-tags --no-write-fetch-head --depth=1 https://github.com/Brett-S-OWB/openwb-ui-settings_BS_folk.git e8de268fa25f7efca2b5ffc005a757a2f36b530f
python scripts/prepare-nissanconnect-2.2.3.py /path/to/new-local-build
cd /path/to/new-local-build/source
npm ci --ignore-scripts --no-audit --no-fund
npx --no-install vitest run src/components/vehicles/nissanconnect/__tests__/vehicle.spec.js
npx --no-install vite build --mode development --outDir ../settings
```

Choose a new destination. The script refuses an existing one and writes
`public-ui.zip`, `source/` and `source-manifest.json`. It does not fetch, install
dependencies, build or access a device itself. The commands above generate local
output; `build-dev` and `build-prod` instead target an installation path and are
not part of this procedure. Use a complete matched output, not isolated asset chunks.

After building, compare these pairs byte-for-byte:

| Source under `source/` | Output under `settings/` |
| --- | --- |
| `public/modules/vehicles/nissanconnect/test_connection.php` | `modules/vehicles/nissanconnect/test_connection.php` |
| `public/modules/vehicles/nissanconnect/connection_test_lib.php` | `modules/vehicles/nissanconnect/connection_test_lib.php` |

The normal Vite build delivers both PHP sources; no extra endpoint-copy step is
needed. The matching Core module must provide
`packages/modules/vehicles/nissanconnect/connection_test.py`. Runtime requirements
are Linux, PHP 7.4+ with `proc_open` and Python 3.9+ at `/usr/bin/python3`.
Run the separate [PHP suite](../tests/nissanconnect/README.md) in this repository;
the preparer does not copy that suite into the pinned tree.

## Scope and validation limits

The display name is **Nissan – MyNISSAN EU (experimental)**. Practical vehicle
evidence covers Leaf ZE1 only; the form explains unofficial API access and normal
credential storage. Core's `packages/modules/vehicles/nissanconnect/docs/user-information.md`
contains the short service/privacy notice.

Synthetic UI checks cover input, selection/save behavior, account changes,
timeouts, cooldowns, odometer availability and per-test HTTP request counts.
The application/MQTT service is not
started, and no account is required. Successful tests or builds do not establish
live API compatibility, charging behavior or suitability for an arbitrary Core
version. Inherited large-chunk/eval warnings and dependency findings remain
separate maintainer concerns. A complete binary distribution also needs its
dependency notices and source-license obligations reviewed; preparing this
source overlay does not grant Nissan API permission or approve distribution.
