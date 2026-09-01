#!/bin/bash
# Run this ONCE on a fresh Oracle Cloud (Ubuntu 24.04) Always Free VM, as the
# default user (e.g. `ubuntu`), over SSH:
#   curl -fsSL https://raw.githubusercontent.com/omonqulovjasurbek04-hue/Sabo-web/main/oracle-bootstrap.sh | bash
# or, after cloning the repo manually: bash oracle-bootstrap.sh
set -euo pipefail

REPO_URL="https://github.com/omonqulovjasurbek04-hue/Sabo-web.git"
APP_DIR="$HOME/Sabo-web"

echo "==> Updating packages"
sudo apt-get update -y
sudo apt-get upgrade -y

echo "==> Installing Docker Engine + Compose plugin"
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | sudo sh
  sudo usermod -aG docker "$USER"
fi

echo "==> Opening OS-level firewall for SSH/HTTP/HTTPS (Oracle images ship with restrictive iptables by default)"
sudo iptables -I INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save 2>/dev/null || (sudo apt-get install -y iptables-persistent && sudo netfilter-persistent save)

echo "==> Fetching SABO source"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" pull
else
  git clone "$REPO_URL" "$APP_DIR"
fi
cd "$APP_DIR"

if [ ! -f .env.production ]; then
  cp .env.production.example .env.production
  echo ""
  echo "!! Created .env.production from the example template with PLACEHOLDER secrets."
  echo "!! Edit it now before continuing:  nano $APP_DIR/.env.production"
  echo "!! Set DOMAIN to your real domain and change every secret/password."
  exit 0
fi

echo "==> Building and starting the stack (first run compiles both apps, this takes a while)"
sudo docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build

echo "==> Done. Check status with: sudo docker compose -f docker-compose.prod.yml ps"
echo "==> Logs: sudo docker compose -f docker-compose.prod.yml logs -f backend"
