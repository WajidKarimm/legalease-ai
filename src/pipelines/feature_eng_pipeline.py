from pathlib import Path
import pandas as pd
import numpy as np

class FeatureEngineeringPipeline:
    def __init__(self, config):
        self.config = config
        self.input_path = Path(config['data']['processed_data_path'])
        self.output_path = Path(config['data']['features_path'])
    
    def load_data(self):
        """Load preprocessed data"""
        return pd.read_csv(self.input_path / 'preprocessed_data.csv')
    
    def create_features(self, data):
        """Create features from preprocessed data"""
        # Add your feature engineering logic here
        return data
    
    def save_features(self, features):
        """Save engineered features"""
        self.output_path.mkdir(parents=True, exist_ok=True)
        features.to_csv(self.output_path / 'features.csv', index=False)
    
    def run(self):
        """Run the feature engineering pipeline"""
        data = self.load_data()
        features = self.create_features(data)
        self.save_features(features)
        return features