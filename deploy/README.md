# Deployment Helpers

This folder contains production helpers for Linux systemd and Docker.

## Systemd (Ubuntu 24.04)

1) Create the data directory and a service user:
```bash
sudo mkdir -p /mnt/data/dyad-data
sudo useradd -r -s /usr/sbin/nologin dyad || true
sudo chown -R dyad:dyad /mnt/data/dyad-data
```

Install runtime tools:
```bash
sudo apt-get update
sudo apt-get install -y git
```

2) Copy the service files and edit the env file:
```bash
sudo mkdir -p /etc/dyad
sudo cp deploy/systemd/dyad.env /etc/dyad/dyad.env
sudo cp deploy/systemd/dyad.service /etc/systemd/system/dyad.service
sudo nano /etc/dyad/dyad.env
```

3) Update the service file to match your repo path:
```bash
sudo nano /etc/systemd/system/dyad.service
```

4) Start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now dyad
```

## Docker

Build and run with the included Dockerfile:
```bash
docker build -t dyad-web .
docker run -p 4000:4000 -v /mnt/data/dyad-data:/data/dyad dyad-web
```

Or use docker compose:
```bash
cp .env.example .env
# edit .env to match your server IP and ports
docker compose up -d
```
