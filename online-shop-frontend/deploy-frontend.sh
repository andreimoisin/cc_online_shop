#!/bin/bash

KEY_PATH=~/Desktop/key-pair-1.pem
USER=ec2-user
HOST=13.61.174.76
TMP_FOLDER=/tmp/frontend-deploy-temp
NGINX_FOLDER=/usr/share/nginx/html

echo "🧱 1. Build React app..."
npm run build

echo "🚀 2. Trimitem fișierele build pe EC2..."
scp -i "$KEY_PATH" -r dist/* $USER@$HOST:$TMP_FOLDER

echo "🔐 3. Ne conectăm și facem backup + replace frontend-ul live..."
ssh -i "$KEY_PATH" $USER@$HOST << EOF
  set -e
  echo "📦 Backup frontend actual..."
  sudo rm -rf /usr/share/nginx/html-backup
  sudo cp -r $NGINX_FOLDER /usr/share/nginx/html-backup

  echo "🧼 Curățăm frontend vechi..."
  sudo rm -rf $NGINX_FOLDER/*

  echo "📤 Copiem noul build în Nginx..."
  sudo cp -r $TMP_FOLDER/* $NGINX_FOLDER/

  echo "✅ Restartăm Nginx..."
  sudo systemctl restart nginx
EOF

echo "Frontend e LIVE pe https://$HOST"