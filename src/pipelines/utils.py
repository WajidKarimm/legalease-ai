import os
import logging
from pathlib import Path

def setup_logging(config):
    """Setup logging configuration"""
    logging.basicConfig(
        level=config['logging']['level'],
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        filename=config['logging']['file']
    )

def ensure_directories(config):
    """Ensure all required directories exist"""
    directories = [
        config['data']['raw_data_path'],
        config['data']['processed_data_path'],
        config['data']['features_path'],
        config['data']['predictions_path'],
        config['model']['save_path'],
        os.path.dirname(config['logging']['file'])
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)