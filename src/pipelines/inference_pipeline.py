from pathlib import Path
import pandas as pd
import joblib

class InferencePipeline:
    def __init__(self, config):
        self.config = config
        self.model_path = Path(config['model']['save_path'])
        self.features_path = Path(config['data']['features_path'])
        self.predictions_path = Path(config['data']['predictions_path'])
    
    def load_model(self):
        """Load trained model"""
        model_file = self.model_path / f"{self.config['model']['name']}.pkl"
        return joblib.load(model_file)
    
    def load_features(self):
        """Load features for inference"""
        return pd.read_csv(self.features_path / 'features.csv')
    
    def make_predictions(self, model, features):
        """Make predictions using the trained model"""
        return model.predict(features)
    
    def save_predictions(self, predictions):
        """Save model predictions"""
        self.predictions_path.mkdir(parents=True, exist_ok=True)
        pd.DataFrame({'predictions': predictions}).to_csv(
            self.predictions_path / 'predictions.csv',
            index=False
        )
    
    def run(self):
        """Run the inference pipeline"""
        model = self.load_model()
        features = self.load_features()
        predictions = self.make_predictions(model, features)
        self.save_predictions(predictions)
        return predictions