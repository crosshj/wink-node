
#lutron-spy (pico remote)
/etc/remote-config.json to setup what happens when button is pressed
/etc/init.d/S59lutron-spy restart
https://github.com/evq/lutron-spy


#consider a different install method besides npm
http://stackoverflow.com/questions/28382773/install-npm-package-without-dependencies


# start and stop service
/etc/init.d/S91homeauto [start|stop]


# start Home Automation Service on Wink startup
```
#!/bin/sh

APP_DIR="/root/homeAuto"
NODE_APP="homeAuto.js"

case "${1}" in
   start)
      echo -n "Home Automation Service Starting..."
      mkdir -p $APP_DIR/logs &
      /usr/bin/node $APP_DIR/$NODE_APP > $APP_DIR/logs/stdout.txt 2> $APP_DIR/logs/stderr.txt &
      ps | grep "Home Automation Service" > /dev/null && echo "[ OK ]" || echo "[ FAIL ]"
      ;;

   stop)
      echo -n "Home Automation Service Stopping..."
      killall -q "Home Automation Service" && echo "[ OK ]" || echo "[ FAIL ]"
      ;;

   restart)
      ${0} stop
      sleep 1
      ${0} start
      ;;

   *)
      echo "Usage: $0 [start|stop|restart]"
      ;;
esac
```
