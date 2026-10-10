# Nissan connection-test checks

The [Nissan source map](../../docs/nissanconnect-source-map.md) locates the
production endpoints, UI, tests and companion Core worker.

The PHP sources belong to `public/modules/vehicles/nissanconnect/`; Vite copies
both unchanged into `modules/vehicles/nissanconnect/` in the settings output.
The deployed endpoint calls the companion Core module's stdin-only Python worker.
The Node CI checks the two built files and runs this PHP suite in a separate job.

Run from this repository with Python 3.9+, pytest and PHP 7.4+:

```sh
python -m pytest -q tests/nissanconnect
```

Use `NISSAN_TEST_PHP` to select a PHP CLI outside PATH. Missing PHP skips the
local PHP tests explicitly; CI checks the executable and syntax first so it
cannot silently skip the suite. Run the Linux filesystem/HTTP checks as an
ordinary user, not root. Windows covers the portable predicates and subprocess
checks; Linux additionally covers ownership, modes, links and loopback HTTP.

Fixtures are synthetic. The suite blocks Python network access; the isolated
HTTP child starts only its own loopback PHP servers and a synthetic worker,
with proxies and redirects disabled. It never imports the Nissan client,
connects to a wallbox, or needs an account. Core owns the Python worker/API tests.
