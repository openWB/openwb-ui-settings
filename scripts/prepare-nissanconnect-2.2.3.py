"""Prepare a pinned, local-only settings source tree for openWB 2.2.3.

Requires Python 3.9+ and Git. Does not fetch, install, build, connect to a
wallbox, or overwrite an existing output directory. See the companion guide.
"""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import zipfile

CORE_TARGET = "3ced7f9cef3c70980ee1fab670f0d0717d1809ca"
UI_BASE = "e8de268fa25f7efca2b5ffc005a757a2f36b530f"
UI_SOURCE = "https://github.com/Brett-S-OWB/openwb-ui-settings_BS_folk"
PAYLOAD_LOGS = {
    "src/App.vue": (
        'console.debug("saving data:", setTopic, payload);',
        'console.debug("saving data:", setTopic);',
    ),
    "src/components/mixins/ComponentState.vue": (
        'console.debug("updateState:", topic, value, objectPath);',
        'console.debug("updateState:", topic, objectPath);',
    ),
    "src/views/VehicleConfiguration.vue": (
        'console.debug("updateConfiguration", key, event);',
        'console.debug("updateConfiguration", key, event.object);',
    ),
}
OVERLAY = (
    "src/components/vehicles/nissanconnect/vehicle.vue",
    "src/components/vehicles/nissanconnect/__tests__/vehicle.spec.js",
    "public/modules/vehicles/nissanconnect/test_connection.php",
    "public/modules/vehicles/nissanconnect/connection_test_lib.php",
)


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path, help="New, empty local build directory to create")
    args = parser.parse_args()
    repo = Path(__file__).resolve().parents[1]
    output = args.output.resolve()
    if output.exists():
        parser.error("Output already exists; choose a new directory. Nothing was changed.")
    subprocess.run(["git", "-C", str(repo), "cat-file", "-e", UI_BASE + "^{commit}"], check=True)
    overlay = {name: (repo / name).read_bytes() for name in OVERLAY}
    revision = subprocess.check_output(["git", "-C", str(repo), "rev-parse", "HEAD"], text=True).strip()
    output.mkdir(parents=True)
    archive = output / "public-ui.zip"
    subprocess.run([
        "git", "-C", str(repo), "archive", "--format=zip", "--output=" + str(archive), UI_BASE,
    ], check=True)
    source = output / "source"
    source.mkdir()
    with zipfile.ZipFile(archive) as exported:
        for entry in exported.infolist():
            if source not in (source / entry.filename).resolve().parents:
                raise ValueError("Archive entry leaves the source directory")
            if (entry.external_attr >> 16) & 0o170000 == 0o120000:
                raise ValueError("Unexpected symbolic link in source archive")
        exported.extractall(source)
    for name, (old, new) in PAYLOAD_LOGS.items():
        path = source / name
        text = path.read_text(encoding="utf-8")
        if text.count(old) != 1:
            raise ValueError("Expected payload log not found exactly once: " + name)
        path.write_bytes(text.replace(old, new).encode("utf-8"))
    for name, data in overlay.items():
        path = source / name
        if path.exists():
            raise ValueError("Overlay unexpectedly already exists: " + name)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
    changed = sorted([*PAYLOAD_LOGS, *OVERLAY])
    manifest = {
        "core_target": CORE_TARGET,
        "ui_source": UI_SOURCE,
        "ui_base": UI_BASE,
        "overlay_checkout_revision": revision,
        "note": "Overlay hashes identify the actual working files, including uncommitted edits.",
        "files": {name: sha256((source / name).read_bytes()) for name in changed},
        "package_lock_sha256": sha256((source / "package-lock.json").read_bytes()),
    }
    (output / "source-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print("Prepared pinned source and manifest in " + str(output))
    print("Next: install the locked dependencies and run tests/build in the source directory.")


if __name__ == "__main__":
    main()
