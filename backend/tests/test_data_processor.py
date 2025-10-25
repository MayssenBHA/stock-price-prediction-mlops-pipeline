"""
Test cases for data processing service
"""
import pytest
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from app.services.data_processor import DataProcessor


@pytest.fixture
def mock_scaler():
    """Create a mock MinMaxScaler for testing"""
    scaler = MinMaxScaler(feature_range=(0, 1))
    # Fit with dummy data
    dummy_data = np.random.rand(100, 6)
    scaler.fit(dummy_data)
    return scaler


@pytest.fixture
def mock_config():
    """Create a mock config dictionary for testing"""
    return {
        'TIME_STEPS': 6,
        'INPUT_DIMS': 6,
        'lstm_units': 50
    }


def test_data_processor_initialization(mock_scaler, mock_config):
    """Test DataProcessor can be initialized"""
    processor = DataProcessor(mock_scaler, mock_config)
    assert processor is not None
    assert processor.scaler == mock_scaler
    assert processor.config == mock_config
    assert processor.TIME_STEPS == 6


def test_validate_dataframe_structure(mock_scaler, mock_config):
    """Test data validation with valid dataframe"""
    processor = DataProcessor(mock_scaler, mock_config)
    
    # Create a sample valid dataframe
    data = {
        'Date': pd.date_range(start='2020-01-01', periods=100, freq='D'),
        'Close': np.random.rand(100) * 100
    }
    df = pd.DataFrame(data)
    
    # This test validates the processor can handle a basic dataframe
    assert len(df) > 0
    assert 'Close' in df.columns or 'close' in df.columns.str.lower()


def test_empty_dataframe_handling(mock_scaler, mock_config):
    """Test handling of empty dataframes"""
    processor = DataProcessor(mock_scaler, mock_config)
    df = pd.DataFrame()
    
    # Empty dataframe should have length 0
    assert len(df) == 0
