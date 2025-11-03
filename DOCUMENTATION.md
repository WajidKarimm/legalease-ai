# LegalEase AI - Project Documentation

## Project Overview
LegalEase AI is a machine learning-powered legal document analysis system that helps identify, classify, and assess legal clauses, extract key entities, and provide relevant legal precedents using RAG (Retrieval Augmented Generation).

## Directory Structure

### 📁 data/
Root directory for all data assets and artifacts.

```
data/
├── raw/          # Original, unprocessed legal documents
├── processed/    # Cleaned and preprocessed documents
├── models/       # Trained model files (.pkl, .pt, etc.)
└── precedents/   # Legal precedent database for RAG
```

**Purpose**: Separates data by processing stage and type, ensuring clean data management and versioning.

### 📁 src/
Core source code of the application.

#### 📁 src/api/
API implementation using FastAPI.

```
src/api/
├── __init__.py    # Package initializer
├── main.py        # FastAPI app setup and configuration
├── routes.py      # API endpoint definitions
├── schemas.py     # Pydantic data models
└── static/        # Frontend static files
    ├── index.html # Single-page UI
    └── app.js     # Frontend JavaScript
```

**Key Components**:
- `main.py`: Configures FastAPI app, static files, and middleware
- `routes.py`: Implements API endpoints for document analysis
- `schemas.py`: Defines data validation models using Pydantic
- `static/`: Contains the web interface for document upload and analysis

#### 📁 src/models/
ML model implementations.

```
src/models/
├── __init__.py
├── clause_classifier.py  # Classifies legal clauses
├── risk_scorer.py       # Assesses risks in clauses
└── ner_extractor.py     # Named Entity Recognition
```

**Components**:
- `clause_classifier.py`: Identifies and categorizes legal clauses
- `risk_scorer.py`: Evaluates potential risks in legal clauses
- `ner_extractor.py`: Extracts named entities (organizations, dates, amounts, etc.)

#### 📁 src/rag/
Retrieval Augmented Generation components.

```
src/rag/
├── __init__.py
├── vector_store.py  # Vector database management
├── retriever.py     # Document retrieval system
└── chains.py        # RAG chain implementation
```

**Components**:
- `vector_store.py`: Manages document embeddings and similarity search
- `retriever.py`: Implements document retrieval logic
- `chains.py`: Combines retrieval and generation for RAG workflow

#### 📁 src/utils/
Utility functions and helpers.

```
src/utils/
├── __init__.py
├── document_parser.py  # Document format handling
├── clause_splitter.py  # Text segmentation
└── config.py          # Configuration management
```

**Components**:
- `document_parser.py`: Handles different document formats (PDF, DOCX)
- `clause_splitter.py`: Splits documents into logical clauses
- `config.py`: Manages application configuration

### 📁 tests/
Unit and integration tests.

```
tests/
├── test_parser.py     # Document parsing tests
├── test_classifier.py # Model tests
└── test_rag.py       # RAG system tests
```

**Purpose**: Ensures code quality and functionality through automated testing.

### 📁 notebooks/
Jupyter notebooks for experimentation and analysis.

```
notebooks/
├── 01_data_exploration.ipynb  # Data analysis
├── 02_model_training.ipynb    # Model training process
└── 03_rag_experiments.ipynb   # RAG system experiments
```

**Purpose**: Documents the research and development process, model training, and experiments.

### 📁 deployment/
Deployment configuration and infrastructure.

```
deployment/
├── Dockerfile         # Container definition
├── docker-compose.yml # Multi-container setup
└── kubernetes/        # K8s manifests
```

**Purpose**: Contains all deployment-related configurations for different environments.

### 📁 docs/
Project documentation.

```
docs/
└── API.md  # API documentation
```

**Purpose**: Technical documentation for API endpoints and usage.

### Root Files

- `requirements.txt`: Python package dependencies
- `.env`: Environment variables (not in version control)
- `.gitignore`: Git ignore patterns
- `README.md`: Project overview and setup instructions

## Key Features

1. **Document Analysis**
   - Clause classification
   - Risk assessment
   - Named entity extraction
   - Legal precedent matching

2. **RAG System**
   - Vector-based document retrieval
   - Context-aware generation
   - Legal precedent integration

3. **Web Interface**
   - Document upload
   - Analysis visualization
   - Results export

## Development Workflow

1. **Data Processing**
   - Raw documents → `data/raw/`
   - Processing scripts in `src/utils/`
   - Processed data → `data/processed/`

2. **Model Training**
   - Experiments in `notebooks/`
   - Model implementation in `src/models/`
   - Trained models → `data/models/`

3. **RAG Setup**
   - Precedent ingestion → `data/precedents/`
   - Vector store setup in `src/rag/`
   - Chain configuration in `src/rag/chains.py`

4. **API Development**
   - Endpoint definition in `src/api/routes.py`
   - Schema updates in `src/api/schemas.py`
   - Frontend updates in `src/api/static/`

5. **Testing**
   - Unit tests in `tests/`
   - Integration testing with `pytest`

6. **Deployment**
   - Local: `docker-compose up`
   - Production: Kubernetes deployment

## Configuration

### Environment Variables (`.env`)
- `DEBUG`: Debug mode flag
- `API_KEY`: API authentication key
- `MODEL_PATH`: Path to model files
- `RAG_INDEX_PATH`: Path to vector store
- `OPENAI_API_KEY`: OpenAI API key for RAG

### Application Config (`config/`)
- `local.yaml`: Development settings
- `prod.yaml`: Production settings

## Dependencies

Key packages and their purposes:
- FastAPI: Web API framework
- Pydantic: Data validation
- Transformers: ML models
- sentence-transformers: Text embeddings
- FAISS: Vector similarity search
- PyTorch: Deep learning
- scikit-learn: ML utilities
- python-docx, PyPDF2: Document parsing

## Getting Started

1. **Environment Setup**
```bash
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\Activate.ps1 on Windows
pip install -r requirements.txt
```

2. **Configuration**
- Copy `.env.example` to `.env`
- Update configuration in `config/`

3. **Run Development Server**
```bash
uvicorn src.api.main:app --reload
```

4. **Access the Application**
- Web Interface: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Testing

Run the test suite:
```bash
pytest tests/
```

## Deployment

### Docker
```bash
cd deployment
docker-compose up --build
```

### Kubernetes
```bash
kubectl apply -f deployment/kubernetes/
```