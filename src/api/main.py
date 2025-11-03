from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from pathlib import Path

from src.api.routes import router
from src.utils.config import load_config

app = FastAPI(title="LegalEase AI", version="0.1")

# Mount static UI
BASE_DIR = Path(__file__).resolve().parent
static_dir = BASE_DIR / "static"
if static_dir.exists():
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

# Include API routes
app.include_router(router)

@app.get("/", response_class=HTMLResponse)
def ui_index():
    """Serve the single-page UI (if present)"""
    index_file = BASE_DIR / "static" / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return HTMLResponse("<html><body><h3>UI not found. Use /predict API.</h3></body></html>")