# LegalEase AI

LegalEase AI is a machine learning-powered legal document analysis system that helps identify, classify, and assess legal clauses, extract key entities, and provide relevant legal precedents using Retrieval Augmented Generation (RAG).

## Key Features

- **Document Analysis**:
  - **Clause Classification**: Identifies and categorizes legal clauses.
  - **Risk Assessment**: Assesses risks in clauses.
  - **Named Entity Recognition (NER)**: Extracts named entities like organizations, dates, and amounts.
  - **Legal Precedent Matching**: Matches clauses with relevant legal precedents.
- **RAG System**:
  - Utilizes a vector-based document retrieval system for finding relevant precedents.
  - Employs a context-aware generation model to provide explanations and summaries.
- **Web Interface**:
  - A user-friendly interface for document upload and analysis.
  - Visualizations for analysis results.
  - Option to export the results.

## Tech Stack

- **Backend**: Python, FastAPI
- **Frontend**: HTML, CSS, JavaScript
- **Machine Learning**: PyTorch, scikit-learn, Transformers, sentence-transformers, FAISS
- **Deployment**: Docker, Kubernetes

## Project Structure

The project is organized into the following directories:

- `src/`: Contains the core source code, including the FastAPI application, machine learning models, data processing pipelines, and RAG components.
- `frontend/`: Holds the static frontend files (HTML, CSS, JavaScript).
- `data/`: Stores all data related to the project, such as raw documents, preprocessed data, trained models, and legal precedents.
- `tests/`: Includes unit and integration tests for the application.
- `notebooks/`: Contains Jupyter notebooks used for data exploration, model training, and experimentation.
- `deployment/`: Provides configurations for deploying the application using Docker and Kubernetes.
- `docs/`: Contains project documentation, including API documentation.

## How to Run Locally

### 1. Backend (API)

To run the backend server, execute the following command from the root directory:

```powershell
uvicorn src.api.main:app --reload
```

The API will be available at `http://localhost:8000`.

### 2. Frontend

To serve the frontend, navigate to the `frontend` directory and start a simple HTTP server:

```powershell
cd frontend
python -m http.server 8080
```

The frontend will be accessible at `http://localhost:8080`.

**Note**: The frontend expects the backend to be running on `http://localhost:8000`. If you are running the backend on a different port, you will need to update the `API_BASE_URL` in `frontend/assets/js/api.js`.
