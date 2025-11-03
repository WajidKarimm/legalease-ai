import os
import yaml
import logging
from pathlib import Path
from src.pipelines.inference_pipeline import InferencePipeline

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
    
    # Initialize inference pipeline
    pipeline = InferencePipeline(config)
    
    # Run inference
    predictions = pipeline.run()
    
    # Save predictions
    output_path = Path(config['data']['predictions_path'])
    output_path.mkdir(parents=True, exist_ok=True)
    predictions.to_csv(output_path / 'predictions.csv', index=False)

if __name__ == '__main__':
    main()