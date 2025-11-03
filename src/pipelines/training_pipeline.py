from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

class TrainingPipeline:
    def __init__(self, config):
        self.config = config
        self.features_path = Path(config['data']['features_path'])
        self.model_params = config['model']['parameters']
    
    def load_data(self):
        """Load features and target for training"""
        features = pd.read_csv(self.features_path / 'features.csv')
        # Assuming last column is target
        X = features.iloc[:, :-1]
        y = features.iloc[:, -1]
        return train_test_split(X, y, test_size=0.2, random_state=42)
    
    def train_model(self, X_train, y_train):
        """Train the model"""
        model = RandomForestClassifier(
            n_estimators=100,
            random_state=42,
            **self.model_params
        )
        model.fit(X_train, y_train)
        return model
    
    def evaluate_model(self, model, X_test, y_test):
        """Evaluate model performance"""
        score = model.score(X_test, y_test)
        print(f"Model accuracy: {score:.4f}")
        return score
    
    def run(self):
        """Run the training pipeline"""
        X_train, X_test, y_train, y_test = self.load_data()
        model = self.train_model(X_train, y_train)
        self.evaluate_model(model, X_test, y_test)
        return model