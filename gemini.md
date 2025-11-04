
# GEMINI.md

## Project Overview

This repository contains **LegalEase AI**, a machine learning-backed legal document analysis system. The project consists of a Python backend built with **FastAPI** and a lightweight, static frontend (HTML/CSS/JS).

The backend provides a REST API for tasks like clause classification, named entity recognition (NER), and risk scoring. The frontend, located in the `frontend/` directory, is a single-page application that interacts with the backend's API endpoints.

The project is containerized using **Docker** and includes a `docker-compose.yml` file for easy setup and deployment. Configuration is managed through YAML files in the `config/` directory.

## Building and Running

### Backend

To run the backend server locally, use the following command from the project root:

```powershell
uvicorn src.api.main:app --reload
```

The API will be available at `http://localhost:8000`.

### Frontend

To serve the frontend, navigate to the `frontend/` directory and run a simple HTTP server:

```powershell
cd frontend
python -m http.server 8080
```

The frontend can then be accessed at `http://localhost:8080`.

### Docker

To run the entire application using Docker, use the following command:

```powershell
docker-compose up
```

This will build the Docker image and start the application, with the API available at `http://localhost:8000`.

## Development Conventions

### Testing

The project uses Python's built-in `unittest` framework for testing. Tests are located in the `tests/` directory and can be run from the command line.

### Configuration

Application configuration is managed through YAML files in the `config/` directory. The `local.yaml` file is used for local development, while `prod.yaml` is intended for production environments.

### API

The frontend communicates with the backend through a dedicated API wrapper located at `frontend/assets/js/api.js`. This file defines the base URL for the API and provides methods for making GET, POST, and file upload requests. The main API endpoints are:

*   `/health`: Health check
*   `/predict`: Main inference endpoint

### Security

A `src/security` package has been scaffolded for implementing security features such as encryption, audit logging, and PII detection. These components are ready to be implemented.
