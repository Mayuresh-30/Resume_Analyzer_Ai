# Resume Analyzer

A full-stack application that compares a resume with a job description and returns structured, actionable feedback. The frontend is built with React and TypeScript; the API uses FastAPI, and resume analysis is powered by a Groq-hosted language model.

## Features

- Upload a PDF or DOCX resume (up to 5 MB) or drag and drop it into the form.
- Compare the resume with a job description of at least 20 characters.
- Review a score, summary, matched skills, missing skills, and prioritized suggestions.
- Extract text from PDF and Word documents, including DOCX tables.
- Keep uploaded files and analysis results out of application storage.

## Technology

- **Frontend:** React, TypeScript, Vite
- **Backend:** Python, FastAPI, Pydantic
- **AI:** Groq API and a configurable Groq model
- **Document parsing:** pypdf and python-docx

## Requirements

- Python 3.13 or newer
- Node.js 20.19+ or 22.12+
- A Groq API key and access to a model enabled for your account

## Run locally

### 1. Configure the backend

From the repository root, create the Python environment and install the backend dependencies:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Create a file named `backend/.env` with your own Groq credentials and model ID:

```dotenv
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
```

Choose a model ID available to your Groq account. Model availability, rate limits, and pricing can change. The `.env` file is excluded from Git.

Start the API from the `backend` directory:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000`. Interactive API documentation is at `http://localhost:8000/docs`.

### 2. Start the frontend

Open a second terminal from the repository root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. Vite forwards `/api` requests to the backend at `http://localhost:8000`.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Returns API status and configured model. |
| `POST` | `/api/analyze` | Accepts multipart fields `resume` (PDF or DOCX) and `job_description` (at least 20 characters), then returns the analysis. |

The analysis response contains `score`, `summary`, `matched_skills`, `missing_skills`, and `suggestions`. Each suggestion includes a category, an issue, and a proposed fix.

## Production build

From the `frontend` directory:

```powershell
npm run build
```

## Privacy and limitations

The application does not persist uploaded resumes or analysis results. Resume text and the supplied job description are sent to Groq to generate the analysis, so use documents you are authorized to submit and review Groq's data-handling terms. The score and suggestions are AI-generated guidance, not a hiring decision or a guarantee of interview outcomes.

Scanned PDFs without extractable text are not OCR-processed. The resume must yield at least 50 characters of readable text.

## Project structure

```text
backend/
	app/
		services/       # Document extraction and Groq analysis
		config.py       # Environment-based settings
		main.py         # FastAPI routes
		schemas.py      # Validated API response models
	requirements.txt
frontend/
	src/
		api/            # Backend requests
		components/     # Upload form and analysis results
		App.tsx
```