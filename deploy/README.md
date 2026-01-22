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
The compose file includes a health check, restart policy, and log rotation defaults.

Linux host networking (avoids binding full preview port ranges):
```bash
docker compose -f docker-compose.yml -f docker-compose.host.yml up -d --build
```

### Compose Mode Differences

- `docker compose up -d` uses `docker-compose.yml` only, running in the default bridge network with explicit port mappings (web port plus the preview proxy range).
- `docker compose -f docker-compose.yml -f docker-compose.host.yml up -d --build` enables `network_mode: host`, so the container uses the host network stack (no port mapping needed) and forces an image rebuild.
