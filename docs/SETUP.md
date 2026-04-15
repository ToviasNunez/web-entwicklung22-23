
# Setup Guide

## Requirements
- Node.js >= 18
- npm
- MongoDB Atlas Account (optional, für Produktivbetrieb)

## Installation
1. Repository klonen
2. Im Projektordner `chxme/` ausführen:
	- `npm install`
	- `cd backend && npm install`
	- `cd ..`
3. Optional: Im Ordner `deff/` für AI-Governance-Tools `npm install`

## Configuration
- `.env` Datei in `chxme/backend/` anlegen (siehe README für Variablen wie MONGO_ATLAS_PW, JWT_KEY, ALLOWED_ORIGINS)
- Demo-Modus: `DEMO_MODE=true` in `.env` für Betrieb ohne Datenbank

## Running the Project
- Frontend: `npm start` im Ordner `chxme/` (Angular)
- Backend: `npm run start:server` im Ordner `chxme/` (Express)
- Demo-Modus: Nur Frontend starten, Backend läuft ohne DB

## Notes
- Für Produktivbetrieb ist eine MongoDB Atlas Instanz erforderlich
- Standard-Port: 4200 (Frontend), 3000 (Backend)
