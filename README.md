# Machine Learning Project — LegalEase AI

This repository contains the LegalEase AI application: an ML-backed legal document analysis system with API and a lightweight frontend. The README below was updated to reflect recent additions (a new standalone frontend directory and security package scaffolding) and to provide clear run & verification steps.

## What changed (recent)
- Added a new frontend located at `frontend/` (static HTML/CSS/JS, ES modules).
- Frontend pages: `index.html`, `pages/*.html` and components in `components/` plus assets in `assets/`.
- Frontend JS uses an `API` wrapper (in `frontend/assets/js/api.js`) and expects backend on http://localhost:8000.
- Added a `src/security` package initializer (`src/security/__init__.py`) — security components (encryption, audit, PII detection, rate limiter, etc.) are scaffolded and ready to implement.

## Project structure (high level)

```
├── config/                 # Configuration files (local/prod YAML)
├── frontend/               # New: static frontend (HTML/CSS/JS)
│   ├── index.html
│   ├── pages/              # dashboard, clause-details, chat, summary
│   ├── components/         # header, sidebar, footer
│   └── assets/             # css, js, images, vendor
├── src/                    # Backend code (FastAPI, models, pipelines)
│   ├── api/                # FastAPI app and routes (serves /predict, /health)
│   ├── models/             # ML model interfaces (classifier, NER, risk scorer)
│   ├── pipelines/          # training & inference pipelines
├── entrypoint/             # scripts for training & inference
├── tests/                  # Unit tests
├── config/                 # local.yaml / prod.yaml
├── Dockerfile
└── docker-compose.yml
```

## Running locally (backend + frontend)

There are two recommended ways to run and test the app locally.

1) Fast way — run backend and serve the frontend separately

Start the backend API (FastAPI + uvicorn):

```powershell
# from repository root (PowerShell)
uvicorn src.api.main:app --reload
```

Serve the frontend directory with a static server (browser modules require HTTP):

```powershell
# from repository root (PowerShell)
cd frontend; python -m http.server 8080
# then open http://localhost:8080 in your browser
```

Notes:
- The frontend JS expects the backend API at `http://localhost:8000` (see `frontend/assets/js/api.js`). If your backend runs on a different host/port, update `API_BASE_URL` in that file.
- The frontend uses ES modules (script type="module"), so loading pages via file:// may fail — always serve them over HTTP.

2) Serve frontend via FastAPI static (optional)

If you prefer to have the backend also serve the frontend, copy the built static files into `src/api/static/` (or mount/copy at deployment time). FastAPI mounts `src/api/static/` and serves `/` (see `src/api/main.py`). Example (quick copy):

```powershell
# copy frontend to api static
Remove-Item -Recurse -Force src\api\static\* -ErrorAction SilentlyContinue
Copy-Item -Recurse -Force frontend\* src\api\static\
# then start the backend
uvicorn src.api.main:app --reload
# open http://localhost:8000
```

## API endpoints (summary)
- GET /health — health check
- POST /predict — main inference endpoint (request model varies between `src/api/app.py` and `src/api/routes.py` depending on code path; typical payloads are JSON with text or list of feature rows)

Examples:

Health check:

```powershell
Invoke-RestMethod http://localhost:8000/health
```

Predict (JSON body example used by `src/api/app.py`):

```powershell
# Example using curl (or use Postman/httpie)
curl -X POST "http://localhost:8000/predict" -H "Content-Type: application/json" -d '{"data": [{"f1":1.0, "f2":2.0}]}'
```

If you run the frontend and click the Clause Analysis upload, it will POST a FormData document to the predict/upload flow using the `API.upload` helper. The front and back must agree on the endpoint shape — currently frontend uses `/predict` for uploads.

## Files added/edited (not exhaustive)
- frontend/
- src/security/__init__.py
- frontend/assets/js/* (api.js, main.js, clause-analysis.js, chat.js, dashboard.js, charts.js)
- frontend/pages/*.html and components/*.html

## Quick verification checklist
1. Start backend:

```powershell
uvicorn src.api.main:app --reload
```

2. Serve frontend:

```powershell
cd frontend; python -m http.server 8080
# open http://localhost:8080
```

3. In browser open Developer Tools → Network and Console, then navigate to Clause Analysis page. Upload a small sample document (or use the Predict UI) and confirm:
- Request is sent to `http://localhost:8000/predict` or `/health` returns OK
- Frontend receives a JSON response and renders results (or logs errors in console)

4. If CORS errors occur, either serve frontend from same origin or enable CORS middleware in FastAPI (add fastapi.middleware.cors.CORSMiddleware in `src/api/main.py`).

## Next steps / TODOs
- Implement security package components in `src/security/` (encryption, audit logging, PII detection, sanitizer, input validator, rate limiter).
- Wire frontend auth and rate-limiting headers.
- Add E2E tests that run the backend and exercise the frontend API calls.

## Troubleshooting
- If ES module imports fail, ensure you're serving the page via HTTP and using modern browsers.
- If endpoints return 404, verify `uvicorn` started without import errors and confirm the routes in `src/api/routes.py` / `src/api/app.py`.

## Contributing
Follow the existing contributing notes: create a branch, make changes, run tests, open a merge request.

---

If you'd like, I can now run quick local checks (start uvicorn, launch a static server) and exercise the `/health` and `/predict` endpoints from the workspace — tell me if you'd like me to proceed and which verification steps you prefer automated now.