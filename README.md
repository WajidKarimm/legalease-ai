# Machine Learning Project

This is a template for a machine learning project with a standardized structure and common components.

## Project Structure

```
├── config/                 # Configuration files
│   ├── local.yaml         # Local development config
│   └── prod.yaml          # Production config
├── data/                  # Data files
│   ├── 01-raw/           # Raw data
│   ├── 02-preprocessed/  # Preprocessed data
│   ├── 03-features/      # Feature engineering outputs
│   └── 04-predictions/   # Model predictions
├── entrypoint/           # Application entry points
│   ├── inference.py      # Model inference script
│   └── train.py          # Model training script
├── notebooks/            # Jupyter notebooks
├── src/                  # Source code
│   └── pipelines/        # ML pipelines
│       ├── feature_eng_pipeline.py
│       ├── inference_pipeline.py
│       ├── training_pipeline.py
│       └── utils.py
├── tests/                # Unit tests
├── .gitlab-ci.yml        # GitLab CI configuration
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile            # Docker configuration
├── requirements-dev.txt  # Development dependencies
└── requirements-prod.txt # Production dependencies
```

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

2. Install dependencies:
```bash
pip install -r requirements-dev.txt
```

## Usage

### Training

To train the model:
```bash
python entrypoint/train.py
```

### Inference

To run inference:
```bash
python entrypoint/inference.py
```

### Running Tests

To run tests:
```bash
python -m pytest tests/
```

### Docker

To build and run using Docker:
```bash
docker-compose up --build
```

## Contributing

1. Create a new branch
2. Make your changes
3. Run tests
4. Submit a merge request