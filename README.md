# ⚖️ LexAI — Legal Document Assistant

> AI-powered legal assistant that helps everyday users create documents, understand legal terms, and find affordable legal help.

---

## 🚧 Project Status
**Active Development** — Hackathon Build (5 Days)

---

## 👥 Team

| Name | Role |
|---|---|
| Person 1 | Frontend / UI |
| Person 2 | AI Integration / Document Logic |
| Person 3 | Templates / Lawyer Finder |
| Person 4 | Prompts / Content / Demo |

---

## 🎯 Features

- **📄 Document Creator** — Chat with AI to generate legal documents (Rent Agreement, Affidavit, NOC, Employment Agreement)
- **🔍 Term Explainer** — Paste any legal clause and get a plain-language breakdown
- **⚖️ Lawyer Finder** — Get nearby lawyer recommendations based on your location and budget

---

## 🛠️ Tech Stack

```
Frontend        React + Tailwind CSS
AI              Google Gemini 1.5 Flash API
Document Gen    HTML templates → Browser Print to PDF
Storage         Browser localStorage (no user data on server)
Container       Docker + docker-compose
Hosting         TBD
```

---

## 📁 Folder Structure

```
legal-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx       # Main chat UI
│   │   │   ├── ModeSelector.jsx     # Switch between 3 modes
│   │   │   └── DocumentPreview.jsx  # Generated doc preview
│   │   ├── utils/
│   │   │   ├── gemini.js            # Gemini API calls
│   │   │   ├── storage.js           # localStorage helpers
│   │   │   └── docGenerator.js      # HTML → PDF logic
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
├── backend/                         # Placeholder for future use
│   └── Dockerfile
├── templates/
│   ├── rent_agreement.html          # Legal document templates
│   ├── affidavit.html
│   └── noc.html
├── prompts/
│   ├── document_prompt.txt          # Gemini system prompts
│   ├── explainer_prompt.txt
│   └── lawyer_prompt.txt
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- Docker (optional)
- Gemini API Key → [Get it here](https://makersuite.google.com/app/apikey)
- Google Places API Key → [Get it here](https://console.cloud.google.com/)

### Setup

```bash
# Clone the repo
git clone https://github.com/your-username/legal-ai.git
cd legal-ai

# Copy env file
cp .env.example .env
# Add your API keys to .env

# Run frontend
cd frontend
npm install
npm run dev
```

### Run with Docker

```bash
docker-compose up
```

App runs at `http://localhost:5173`

---

## 🔑 Environment Variables

Create a `.env` file in root:

```
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_GOOGLE_PLACES_KEY=your_google_places_key_here
```

---

## 📄 Document Templates Available

| Template | Fields Required |
|---|---|
| Rent Agreement | Landlord, Tenant, Address, Rent, Duration |
| Affidavit | Name, Statement, Date, Place |
| NOC Letter | Issuer, Recipient, Purpose, Date |
| Employment Agreement | Employer, Employee, Role, Salary, Start Date |

---

## 🧠 How the AI Works

```
User chats naturally
        ↓
Gemini extracts required fields via conversation
        ↓
Returns structured JSON when all fields collected
        ↓
JSON fills HTML template
        ↓
Browser prints to PDF → user downloads
```

---

## 🔒 Privacy

- No login required
- No user data stored on any server
- All data lives in your browser's localStorage only
- "Clear my data" button wipes everything locally

---

## 🗓️ Build Timeline

| Day | Goal |
|---|---|
| 1 | Chat UI + Gemini API connected |
| 2 | Document filling flow working |
| 3 | Term explainer + Lawyer finder |
| 4 | Integration + bug fixes |
| 5 | Polish + demo prep |

---

## 🤝 Contributing (Team Only)

- Branch naming: `feature/your-feature-name`
- Never push directly to `main`
- PR required to merge
- Keep `.env` out of commits — it's in `.gitignore`

---

## 📌 TODO

- [ ] Set up React project
- [ ] Connect Gemini API
- [ ] Build Chat UI component
- [ ] Write document prompts
- [ ] Build 3 HTML templates
- [ ] Implement localStorage
- [ ] Google Places integration
- [ ] Docker setup
- [ ] Final demo script

---

*Built for FlowZint AI Hackathon 2026*
