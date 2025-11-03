import os
import yaml
import logging
from pathlib import Path
from src.pipelines.training_pipeline import TrainingPipeline

def load_config(config_path: str):
    with open(config_path, 'r') as f:
        return yaml.safe_load(f)

def main():
    # Load configuration
    config = load_config('config/prod.yaml')
    
    # Initialize logging
    logging.basicConfig(
        level=config['logging']['level'],
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Initialize training pipeline
    pipeline = TrainingPipeline(config)
    
    # Run training
    model = pipeline.run()
    
    # Save model
    model_path = Path(config['model']['save_path'])
    model_path.mkdir(parents=True, exist_ok=True)
    model.save(model_path / f"{config['model']['name']}.pkl")

if __name__ == '__main__':
    main()