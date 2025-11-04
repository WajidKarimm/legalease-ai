from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from pathlib import Path

from src.api.routes import router
from src.utils.config import load_config

app = FastAPI(title="LegalEase AI", version="0.1")

# Set up base directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # go up to project root
static_dir = BASE_DIR / "frontend"

# Include API routes first
app.include_router(router, prefix="/api")

# Mount static assets under /assets
if (static_dir / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(static_dir / "assets")), name="assets")

# Mount other static directories if they exist
for static_subdir in ["components", "pages"]:
    if (static_dir / static_subdir).exists():
        app.mount(f"/{static_subdir}", StaticFiles(directory=str(static_dir / static_subdir)), name=static_subdir)

@app.get("/", response_class=HTMLResponse)
def ui_index():
    """Serve the single-page UI"""
    index_file = static_dir / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return HTMLResponse("<html><body><h3>UI not found. Use /api/predict endpoint.</h3></body></html>")