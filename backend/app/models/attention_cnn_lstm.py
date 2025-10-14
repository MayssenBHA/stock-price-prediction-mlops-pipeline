"""
Attention-Based CNN-LSTM Model Architecture
"""
from keras.layers import Input, Permute, Dense, Lambda, RepeatVector, Multiply, Conv1D, Dropout, Bidirectional, LSTM, Flatten
from keras.models import Model
import tensorflow as tf
from tensorflow.keras import backend as K


def attention_3d_block(inputs, single_attention_vector=False):
    """
    Attention mechanism for 3D input
    Args:
        inputs: shape = (batch_size, time_steps, input_dim)
        single_attention_vector: whether to use single attention vector
    Returns:
        output_attention_mul: attention-weighted output
    """
    time_steps = tf.keras.backend.int_shape(inputs)[1]
    input_dim = tf.keras.backend.int_shape(inputs)[2]
    
    a = Permute((2, 1))(inputs)
    a = Dense(time_steps, activation='softmax')(a)
    
    if single_attention_vector:
        a = Lambda(lambda x: K.mean(x, axis=1))(a)
        a = RepeatVector(input_dim)(a)

    a_probs = Permute((2, 1))(a)
    # Element-wise multiplication
    output_attention_mul = Multiply()([inputs, a_probs])
    return output_attention_mul


def attention_model(INPUT_DIMS=6, TIME_STEPS=6, lstm_units=50):
    """
    Build Attention-Based CNN-LSTM model
    Args:
        INPUT_DIMS: number of input features (default: 6)
        TIME_STEPS: number of time steps (default: 6)
        lstm_units: number of LSTM units (default: 50)
    Returns:
        model: compiled Keras model
    """
    inputs = Input(shape=(TIME_STEPS, INPUT_DIMS))

    # CNN layer
    x = Conv1D(filters=50, kernel_size=1, activation='relu')(inputs)
    x = Dropout(0.2)(x)

    # Bidirectional LSTM layer
    lstm_out = Bidirectional(LSTM(lstm_units, return_sequences=True))(x)
    lstm_out = Dropout(0.2)(lstm_out)
    
    # Attention layer
    attention_mul = attention_3d_block(lstm_out)
    attention_mul = Flatten()(attention_mul)

    # Output layer
    output = Dense(1, activation='sigmoid')(attention_mul)
    
    # Create model
    model = Model(inputs=[inputs], outputs=output)
    
    return model
