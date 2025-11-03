# LegalEase AI API Documentation

## Overview

The LegalEase AI API provides endpoints for legal document analysis, including:
- Clause classification
- Risk assessment
- Named Entity Recognition (NER)
- RAG-based legal precedent search

## Authentication

API requests require an API key to be included in the Authorization header:

```
Authorization: Bearer <your_api_key>
```

## Endpoints

### Health Check

```
GET /health
```

Returns API health status.

### Document Analysis

```
POST /predict
Content-Type: application/json

{
    "text": "Legal document text..."
}
```

Returns:
```json
{
    "clauses": [
        {
            "text": "...",
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
            "metadata": {
                "role": "buyer"
            }
        }
    ]
}
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 500: Internal Server Error

Error responses include a detail message:
```json
{
    "detail": "Error message here"
}
```