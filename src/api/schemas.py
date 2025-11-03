from pydantic import BaseModel
from typing import List, Dict

class PredictRequest(BaseModel):
    """Request model for document analysis"""
    text: str
    
    class Config:
        schema_extra = {
            "example": {
                "text": "This Agreement is made between Party A and Party B..."
            }
        }

class Clause(BaseModel):
    """Model for classified clauses"""
    text: str
    type: str
    confidence: float

class Risk(BaseModel):
    """Model for identified risks"""
    clause_id: int
    level: str
    description: str
    confidence: float

class Entity(BaseModel):
    """Model for extracted named entities"""
    text: str
    type: str
    start: int
    end: int
    metadata: Dict[str, str]

class PredictResponse(BaseModel):
    """Response model with analysis results"""
    clauses: List[Clause]
    risks: List[Risk]
    entities: List[Entity]
    
    class Config:
        schema_extra = {
            "example": {
                "clauses": [
                    {
                        "text": "Party A shall pay...",
                        "type": "payment_terms",
                        "confidence": 0.95
                    }
                ],
                "risks": [
                    {
                        "clause_id": 1,
                        "level": "high",
                        "description": "Unclear payment terms",
                        "confidence": 0.85
                    }
                ],
                "entities": [
                    {
                        "text": "Party A",
                        "type": "ORGANIZATION",
                        "start": 0,
                        "end": 7,
                        "metadata": {"role": "buyer"}
                    }
                ]
            }
        }