# openwb-ui-settings
GUI for openWB v2.0+

## License
This project is licensed under GPLv3. Any commercial use must be authorized by openWB GmbH & Co. KG.

## Recommended Dev Environment
- VS Code
- VS Code Remote SSH Extension for developement on the target system
- nodejs 14.x
- Vue.js devtools browser extension for debugging

## Project setup
```
npm install
```
It may be necessary to increase the number of allowed file watchers.
Add this line to your `/etc/sysctl.d/local.conf` and reboot your system:
```
fs.inotify.max_user_watches=524288
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

### Compiles a development build with /var/www/html/openWB/ as target
```
npm run build-dev
```

### Compiles a production build with /var/www/html/openWB/ as target
```
npm run build-prod
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
