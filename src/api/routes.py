from fastapi import APIRouter, HTTPException, File, UploadFile
from src.api.schemas import PredictResponse
from src.models.clause_classifier import ClauseClassifier
from src.models.risk_scorer import RiskScorer
from src.models.ner_extractor import NERExtractor
import logging

router = APIRouter()

# Initialize models
clause_classifier = None
risk_scorer = None
ner_extractor = None

@router.on_event("startup")
async def startup_event():
    global clause_classifier, risk_scorer, ner_extractor
    try:
        clause_classifier = ClauseClassifier()
        risk_scorer = RiskScorer()
        ner_extractor = NERExtractor()
    except Exception as e:
        logging.error(f"Error loading models: {str(e)}")

@router.get("/health")
def health():
    """Health check endpoint"""
    return {"status": "ok"}

@router.post("/predict", response_model=PredictResponse)
async def predict(document: UploadFile = File(...)):
    """Process legal document and return predictions"""
    if not all([clause_classifier, risk_scorer, ner_extractor]):
        raise HTTPException(status_code=503, detail="Models not loaded")
    
    try:
        # Read the file content
        content = await document.read()
        text = content.decode("utf-8")

        # Process the document through our pipeline
        clauses = clause_classifier.predict(text)
        risks = risk_scorer.predict(clauses)
        entities = ner_extractor.predict(text)
        
        return PredictResponse(
            clauses=clauses,
            risks=risks,
            entities=entities
        )
    except Exception as e:
        logging.exception("Error during prediction")
        raise HTTPException(status_code=500, detail=str(e))