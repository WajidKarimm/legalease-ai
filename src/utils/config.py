from pathlib import Path
import yaml
from typing import Dict, Any

def load_config(env: str = "prod") -> Dict[str, Any]:
    """
    Load configuration from YAML file
    
    Args:
        env: Environment name ('prod' or 'local')
        
    Returns:
        Configuration dictionary
    """
    config_dir = Path(__file__).parent.parent.parent / "config"
    config_file = config_dir / f"{env}.yaml"
    
    if not config_file.exists():
        raise FileNotFoundError(f"Config file not found: {config_file}")
    
    with open(config_file, "r") as f:
        config = yaml.safe_load(f)
    
    return config

def get_model_path(model_name: str) -> Path:
    """Get path to saved model file"""
    return Path(__file__).parent.parent.parent / "data" / "models" / f"{model_name}.pkl"

def get_data_path(data_type: str) -> Path:
    """Get path to data directory"""
    return Path(__file__).parent.parent.parent / "data" / data_type