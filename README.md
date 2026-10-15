::: {align="center"}
# 🛡️ CyberPulse

### Learn cyber safety. Recognize threats. Respond with confidence.

**An AI-assisted cyber-awareness and incident-guidance demo built for
students and everyday users.**

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Backend-Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Local
AI](https://img.shields.io/badge/Optional%20AI-Ollama-111111?logo=ollama&logoColor=white)](https://ollama.com/)
[![Status](https://img.shields.io/badge/Status-Educational%20Prototype-blue)](#-scope-and-safety)
:::

------------------------------------------------------------------------

## 📌 About

CyberPulse is a cyber-safety learning prototype designed to make
cybersecurity awareness more practical and interactive. It combines
short learning modules, scenario-based quizzes, a simulated phishing
lab, and a guided incident-response assistant in one web application.

The project is organized around three core pillars:

-   **Interactive E-Book** --- learn essential cyber-safety concepts
    through eight short modules.
-   **Awareness Quiz Engine** --- answer scenario-based questions,
    review explanations, and track quiz attempts.
-   **Incident Assistant** --- get a prioritized response checklist,
    with optional locally hosted AI-generated guidance through Ollama.

The prototype also includes a **Phishing Lab**, a dashboard, and an
India-focused help directory.

> **Project type:** College demonstration / educational prototype. It is
> not a production security product.

## ✨ Features

  -----------------------------------------------------------------------
  Feature                             What it does
  ----------------------------------- -----------------------------------
  📚 Interactive learning             Eight lessons with completion
                                      progress saved to SQLite

  🧠 Awareness quiz                   Seven scenario-based questions,
                                      scoring, explanations, and saved
                                      attempts

  🎣 Phishing Lab                     Sample messages and a transparent,
                                      rule-based text heuristic

  🆘 Incident Assistant               Guided response plans for six
                                      incident categories

  🤖 Optional local AI                Connects to an Ollama model running
                                      on your own computer

  📊 Progress dashboard               Shows learning and quiz activity

  🇮🇳 Help directory                   India-focused reporting and support
                                      references

  💾 Persistent local data            SQLite database is created
                                      automatically on first run

  🔌 REST API                         Express endpoints support the app's
                                      learning, quiz, dashboard, and
                                      incident features
  -----------------------------------------------------------------------

## 🖥️ Tech stack

-   **Runtime:** Node.js 20+
-   **Server:** Express
-   **Database:** SQLite via `better-sqlite3`
-   **Frontend:** HTML, CSS, vanilla JavaScript
-   **Optional AI runtime:** Ollama
-   **Default AI model in the example configuration:** `llama3.2:3b`

No paid AI API key is required for the core application. Without Ollama,
the Incident Assistant uses its built-in rule-based checklist.

## 🚀 Run locally

### Prerequisites

-   Windows, macOS, or Linux
-   [Node.js 20 or newer](https://nodejs.org/) and npm
-   Git (optional, if cloning the repository)
-   Ollama only if you want local AI-generated responses

### 1. Get the project

Clone your public repository, replacing the placeholder with your
repository URL:

``` bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
```

Or download the repository ZIP from GitHub and extract it.

### 2. Install dependencies

``` bash
npm install
```

### 3. Create your environment file

**Windows PowerShell:**

``` powershell
Copy-Item .env.example .env
```

**Windows Command Prompt:**

``` bat
copy .env.example .env
```

**macOS / Linux:**

``` bash
cp .env.example .env
```

The default `.env.example` values are suitable for local development:

``` env
PORT=3000
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:3b
CORS_ORIGIN=
```

### 4. Start CyberPulse

``` bash
npm start
```

Open **http://localhost:3000** in your browser.

The database is initialized automatically on first run at
`data/cyberpulse.sqlite`. Keep the terminal running while using the
site.

## 🤖 Enable local AI with Ollama

Ollama lets CyberPulse request model-generated guidance from a model
running locally. The model is downloaded once; responses use your
computer's resources. Model performance depends on RAM, CPU/GPU, model
size, and context length.

### 1. Install Ollama

Download and install it from [ollama.com](https://ollama.com/).

### 2. Download a model

For a lightweight demonstration on a modest laptop, DeepSeek-R1 1.5B is
one option:

``` bash
ollama pull deepseek-r1:1.5b
```

Test the model:

``` bash
ollama run deepseek-r1:1.5b
```

Type `/bye` to leave the interactive model chat. Ollama normally runs as
a background service on Windows after installation.

### 3. Configure CyberPulse

Edit `.env` in the project root:

``` env
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=deepseek-r1:1.5b
```

Keep the other environment settings from `.env.example`, including
`PORT`, unless you need to change them. Restart the website after
editing `.env`:

``` bash
npm start
```

Open the **Incident Assistant** page and submit a test scenario. If the
configured local model is available, the server can request a response
from Ollama. If Ollama is unavailable, the built-in rule-based checklist
is intended to remain available.

**Note:** A successful website health check only proves the web server
is running; it does not by itself prove that the model answered a
request.

## 🧪 Try the demo

Example scenario for the Incident Assistant:

> I clicked a suspicious bank link and entered my password. What should
> I do immediately?

Other demo ideas:

-   Complete an e-book lesson and check the progress dashboard.
-   Take the awareness quiz and review the explanations.
-   Analyze one of the provided sample messages in the Phishing Lab.
-   Try different incident categories and compare the generated
    checklists.

Use fictional examples only. Do not enter real passwords, OTPs, PINs,
card numbers, or private incident details.

## 🗂️ Project structure

``` text
CyberPulse/
├── public/
│   ├── index.html       # App interface
│   ├── styles.css       # Visual theme and responsive styling
│   └── app.js           # Frontend interactions
├── .env.example         # Example environment configuration
├── .gitignore           # Files excluded from Git
├── package.json         # Dependencies and scripts
├── package-lock.json    # Created by npm install (if committed)
├── server.js            # Express API, SQLite, and Ollama integration
└── README.md
```

The `data/` directory and SQLite database are created at runtime and
should not be committed to Git.

## 🔗 API overview

The Express server exposes these main endpoints:

  Method   Endpoint                      Purpose
  -------- ----------------------------- ------------------------------------
  `GET`    `/api/health`                 Basic backend health check
  `GET`    `/api/lessons`                Retrieve learning modules
  `POST`   `/api/lessons/:id/complete`   Save lesson completion
  `GET`    `/api/quiz`                   Retrieve quiz content
  `POST`   `/api/quiz/submit`            Submit a quiz attempt
  `GET`    `/api/dashboard`              Retrieve dashboard information
  `GET`    `/api/phishing/samples`       Retrieve sample messages
  `POST`   `/api/phishing/analyze`       Analyze text using the heuristic
  `POST`   `/api/incidents`              Generate an incident response plan
  `GET`    `/api/incidents/recent`       Retrieve recent incident records

## 🌐 Deployment notes

CyberPulse is a **Node.js server application**, not a static-only site.
Use a host that supports Node.js and provides persistent writable
storage for SQLite.

For deployment:

1.  Configure the host to install dependencies and run `npm start`.
2.  Set environment variables in the host dashboard rather than
    uploading your local `.env`.
3.  Confirm that the database is stored on persistent storage; some
    hosting platforms erase local files during redeployments.
4.  `127.0.0.1` on a hosted server refers to that server---not your
    personal computer. A locally installed Ollama instance on your
    laptop will not automatically be available to the hosted website.
5.  Do not expose Ollama's local API directly to the public internet.
6.  Before public use, add appropriate authentication or abuse controls
    where needed, rate limiting, secure deployment settings, monitoring,
    backups, and a security review.

For a multi-instance deployment, replace the local SQLite setup with a
managed database and add an appropriate migration strategy.

## 🔐 Privacy and safety

-   Incident descriptions may be stored in the local SQLite database.
-   If local Ollama is enabled, prompts are sent to the Ollama service
    configured in `.env`; with the default URL, this is the local
    machine.
-   Do not submit passwords, OTPs, PINs, recovery codes, full
    payment-card numbers, or other secrets.
-   The Phishing Lab is a simple text-based heuristic. It does not visit
    URLs, perform live domain reputation checks, or guarantee a correct
    verdict.
-   AI-generated content can be inaccurate or incomplete. Verify
    important guidance with official sources.
-   The help directory is informational; verify contact details and
    reporting routes against official sources before relying on them.

## ⚠️ Scope and safety

CyberPulse is an educational demonstration. It is not a substitute for
professional incident response, forensic investigation, legal advice, or
emergency services. It does not guarantee detection of phishing,
malware, fraud, or other threats. Do not use it as the sole basis for
security-critical decisions.

## 🛠️ Troubleshooting

**`ollama` is not recognized**

Restart your terminal after installing Ollama. If necessary, confirm
Ollama is installed and available on your system PATH.

**The website opens, but AI responses do not appear**

1.  Check that `ollama list` includes the model named in `.env`.
2.  Test the model directly with `ollama run deepseek-r1:1.5b`.
3.  Check that `OLLAMA_URL` is `http://127.0.0.1:11434` for a local
    Windows setup.
4.  Restart CyberPulse after changing `.env`.
5.  Check the terminal running `npm start` for errors. The rule-based
    fallback may still work if local AI is unavailable.

**Port 3000 is already in use**

Change `PORT` in `.env` to an available port, then restart the server.

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome.

1.  Fork the repository.
2.  Create a branch for your change.
3.  Make and test your changes locally.
4.  Open a pull request describing the change and how it was tested.

Please do not submit real personal data, credentials, private incident
reports, or database files in issues or pull requests.

## 📄 License

No license has been specified yet. If you intend to invite reuse or
contributions, choose a license and add a `LICENSE` file before
publishing. Until then, do not assume that the repository grants
permission to reuse the code.

------------------------------------------------------------------------

::: {align="center"}
**CyberPulse --- Cyber Safety Hub**

*Built as an educational project to make cyber awareness more
interactive.*
:::
