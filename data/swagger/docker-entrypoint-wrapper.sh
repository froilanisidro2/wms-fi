#!/bin/sh

# This script injects environment variables into a JavaScript file
# It's meant to be used as a pre-initialization script for the Swagger UI container

# Create a new JavaScript file that sets the API_PORT as a global variable
if [ -n "$API_PORT" ]; then
  cat > /usr/share/nginx/html/env-config.js << EOF
window.API_PORT = '$API_PORT';
EOF
  echo "API_PORT environment variable set to: $API_PORT"
fi
