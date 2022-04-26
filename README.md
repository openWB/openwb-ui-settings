# openwb-ui-settings
GUI for openWB v2.0+

## License
This project is licensed under GPLv3. Any commercial use must be authorized by openWB GmbH & Co. KG.

## Recommended Dev Environment
- VS Code
- VS Code Remote SSH Extension for development on the target system
- npm 7.5.x
- nodejs 14.x
- Vue.js devtools browser extension for debugging

## Project setup
**IMPORTANT:**
Due to a bug in vue-loader please clone this repo into `/opt/openwb-dev/openwb-ui-settings`. The full path is referenced on import and as a result the filename hashes will be different for every other path used. Hope this will be fixed soon.

```
npm install
```
It may be necessary to increase the number of allowed file watchers.
Add this line to your `/etc/sysctl.d/99-local.conf`:
```
fs.inotify.max_user_watches=524288
```
Then reboot your system or update sysctl:
```
sudo sysctl --system -p
```

### Compiles and hot-reloads for development
```
npm run serve
```
If working with remote ssh extension, port 8080 will be redirected automatically.
Manually add port 9001 for accessing mosquitto on remote system.
Then point your browser to http://localhost:8080/openWB/web/settings/ to get started.

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Run provided unit tests
```
npm run test:unit
```

### Compiles a development build with /var/www/html/openWB/web/settings/ as target
```
npm run build-dev
```

### Compiles a production build with /var/www/html/openWB/web/settings/ as target
```
npm run build-prod
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
