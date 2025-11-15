#!/bin/sh

# This script processes the nginx configuration template
# and replaces environment variables with their values

# Use envsubst to process the template and save it to the nginx config directory
envsubst '${API_KEY}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "API_KEY environment variable injected into nginx configuration: ${API_KEY:0:5}..."

# Continue with the original command (start nginx)
exec nginx -g "daemon off;"
