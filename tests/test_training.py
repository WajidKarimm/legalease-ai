import unittest
from pathlib import Path
import yaml
from src.pipelines.training_pipeline import TrainingPipeline

class TestTraining(unittest.TestCase):
    def setUp(self):
        # Load test configuration
        with open('config/local.yaml', 'r') as f:
            self.config = yaml.safe_load(f)
        
        # Initialize pipeline
        self.pipeline = TrainingPipeline(self.config)
    
    def test_load_data(self):
        """Test data loading functionality"""
        X_train, X_test, y_train, y_test = self.pipeline.load_data()
        self.assertIsNotNone(X_train)
        self.assertIsNotNone(X_test)
        self.assertIsNotNone(y_train)
        self.assertIsNotNone(y_test)
    
    def test_train_model(self):
        """Test model training functionality"""
        X_train, X_test, y_train, y_test = self.pipeline.load_data()
        model = self.pipeline.train_model(X_train, y_train)
        self.assertIsNotNone(model)
    
    def test_evaluate_model(self):
        """Test model evaluation functionality"""
        X_train, X_test, y_train, y_test = self.pipeline.load_data()
        model = self.pipeline.train_model(X_train, y_train)
        score = self.pipeline.evaluate_model(model, X_test, y_test)
        self.assertGreater(score, 0)
        self.assertLessEqual(score, 1)

if __name__ == '__main__':
    unittest.main()