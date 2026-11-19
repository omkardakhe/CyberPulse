# CyberPulse Advanced — College Demo Prototype

A full-stack CyberPulse prototype based on the project presentation's three pillars:

1. **Interactive E-Book** — eight learning modules with progress saved in SQLite.
2. **Awareness Quiz Engine** — scenario questions, explanations, score calculation and saved attempts.
3. **Incident Assistant** — prioritised response checklists with optional local AI through Ollama.

Additional feature: **Phishing Lab**, with simulated examples and a transparent rule-based text scanner.

## Stack

- Node.js + Express backend
- SQLite database (`better-sqlite3`)
- HTML, CSS and vanilla JavaScript frontend
- Optional local LLM through Ollama (no paid API required)
- No API key required for core functionality

## Requirements

- Node.js 20 or newer
- npm
- Internet access only to download npm packages during installation
- Optional: Ollama installed locally for model-generated incident guidance

## Run on Windows

1. Extract `CyberPulse_Advanced.zip` to a folder, for example `C:\CyberPulse_Advanced`.
2. Open that folder in Command Prompt or VS Code terminal.
3. Install dependencies:

   ```bat
   npm install
   ```

4. Create your environment file:

   ```bat
   copy .env.example .env
   ```

5. Start the application:

   ```bat
   npm start
   ```

6. Open **http://localhost:3000** in your browser.

The SQLite database is created automatically at `data/cyberpulse.sqlite` on first run.

## Optional local AI with Ollama

The website works without Ollama. Without it, the incident assistant uses its local rule-based response checklist.

1. Install Ollama from its official website: https://ollama.com/
2. In a terminal, download a model. For a modest laptop, start with:

   ```bat
   ollama pull llama3.2:3b
   ```

3. Ensure Ollama is running. Usually its local API is available at `http://127.0.0.1:11434`.
4. In `.env`, set:

   ```env
   OLLAMA_URL=http://127.0.0.1:11434
   OLLAMA_MODEL=llama3.2:3b
   ```

5. Restart CyberPulse with `npm start`. Open Incident Assistant and generate a plan. The UI identifies when a local model response was used.

Local AI performance depends on the model and available RAM. The fallback works even when the model is unavailable.

## Main pages

- Overview: project dashboard and progress snapshot
- Interactive E-Book: eight lessons and lesson completion
- Awareness Quiz: seven scenario questions with explanation and saved results
- Phishing Lab: simulated examples and text-only heuristic scanner
- Incident Assistant: six incident categories, response plans, optional Ollama
- Help Directory: India-focused reporting references
- About: project scope, pillars and team details

## Online deployment

This is a Node.js server application, not a static-only website. Deploy to a host that supports Node.js and persistent disk storage.

1. Push the project folder to a private/public Git repository (do not commit `.env`, `node_modules` or database files).
2. Choose a Node.js host that supports running `npm install` and `npm start`.
3. Set `PORT` using the host's environment settings if required.
4. Ensure the host provides a **persistent writable disk** and set up the database directory on that disk if the host's filesystem is ephemeral.
5. If using Ollama, it must be reachable by the server. A local `127.0.0.1` on a hosted server refers to that server, not your laptop. Do not expose Ollama's unauthenticated API directly to the public internet.
6. Use HTTPS, backups, rate limiting, appropriate logging and security review before allowing public users.

**Important SQLite hosting note:** do not run multiple app instances against a local SQLite file on ephemeral storage. For a multi-instance public deployment, replace SQLite with a managed database such as PostgreSQL and add migrations.

## API endpoints

- `GET /api/health`
- `GET /api/lessons`
- `POST /api/lessons/:id/complete`
- `GET /api/quiz`
- `POST /api/quiz/submit`
- `GET /api/dashboard`
- `GET /api/phishing/samples`
- `POST /api/phishing/analyze`
- `POST /api/incidents`
- `GET /api/incidents/recent`

## Demo limitations and safety

- The phishing scanner is a simple keyword/rule heuristic. It does not visit URLs, inspect domains or guarantee a verdict.
- Ollama integration is optional and local. AI output may be incorrect; verify important advice with official sources.
- This is a college demonstration prototype, not a production cybersecurity platform, a live incident investigation service, legal advice or a substitute for emergency services.
- Do not enter passwords, OTPs, PINs, full card numbers or other secrets. Incident descriptions are stored in the local SQLite database.
- The help directory's contact references should be checked against official sources before a public release.
