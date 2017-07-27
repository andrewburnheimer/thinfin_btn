#!/bin/sh

export PATH=$PATH:/usr/bin
export NODE_PATH=$NODE_PATH:/usr/local/lib/node_modules:/opt/app/thinfin_btn/node_modules
export SERVER_PORT=80
export SERVER_IFACE='0.0.0.0'

case "$1" in
  start)
  exec forever --sourceDir=/opt/app/thinfin_btn --uid 'thinfin_btn' -a -p /opt/run/forever start server.js
  ;;

  stop)
  exec forever stop thinfin_btn
  ;;
esac

exit 0
