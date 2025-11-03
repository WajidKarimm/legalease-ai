from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from pydantic import BaseModel
from pathlib import Path
import logging

from src.pipelines.inference_pipeline import InferencePipeline


class PredictRequest(BaseModel):
    # expect CSV-like rows as list of dicts or a features matrix
    data: list


class PredictResponse(BaseModel):
    predictions: list


app = FastAPI(title="legalease-ai Inference API", version="0.1")


# initialize global pipeline placeholder
pipeline = None

# mount static UI
BASE_DIR = Path(__file__).resolve().parent
static_dir = BASE_DIR / "static"
if static_dir.exists():
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")


@app.on_event("startup")
def startup_event():
    global pipeline
    logging.info("Starting API and loading model...")
    # Load production config by default
    import yaml

    cfg_path = Path("config/prod.yaml")
    if not cfg_path.exists():
        cfg_path = Path("config/local.yaml")

    with open(cfg_path, "r") as f:
        config = yaml.safe_load(f)

    pipeline = InferencePipeline(config)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/", response_class=HTMLResponse)
def ui_index():
    # Serve the single-page UI (if present)
    index_file = BASE_DIR / "static" / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return HTMLResponse("<html><body><h3>UI not found. Use /predict API.</h3></body></html>")


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    global pipeline
    if pipeline is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    # Expecting JSON list of rows; convert to a DataFrame inside the pipeline
    try:
        import pandas as pd

        features = pd.DataFrame(req.data)
        # Save a temp features file in the features path so pipeline.load_features can be reused if needed
        # But we'll call pipeline.make_predictions directly if pipeline supports it
        if hasattr(pipeline, "make_predictions"):
            model = pipeline.load_model()
            preds = pipeline.make_predictions(model, features)
        else:
            # Fallback: pipeline.run() if it expects to read CSVs
            preds = pipeline.run()

        return PredictResponse(predictions=preds.tolist() if hasattr(preds, 'tolist') else list(preds))
    except Exception as e:
        logging.exception("Error during prediction")
        raise HTTPException(status_code=500, detail=str(e))
