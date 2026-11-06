#!/bin/sh
# Container start-up script
#  1. Inserts the $PORT value into the Nginx config
#  2. Writes container info (hostname, start time) for the website to display
#  3. Starts Nginx in the foreground (so Docker can supervise it)
set -e

PORT="${PORT:-8080}"
export PORT

# Only substitute ${PORT}; leave Nginx variables like $uri untouched
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /tmp/nginx/nginx.conf

cat > /usr/share/nginx/html/info.json <<EOF
{
  "hostname": "$(hostname)",
  "started": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "port": "${PORT}",
  "server": "$(nginx -v 2>&1 | sed 's/.*: //')",
  "os": "$(. /etc/os-release && echo "$PRETTY_NAME")"
}
EOF

echo "Starting Nginx on port ${PORT} ..."
nginx -t -c /tmp/nginx/nginx.conf
exec nginx -c /tmp/nginx/nginx.conf -g 'daemon off;'
