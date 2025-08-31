import React, { useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Line } from 'react-chartjs-2';

const PredictiveAnalytics = ({ sensorId, apiUrl }) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch historical data for the sensor
  const fetchHistoricalData = useCallback(async () => {
    if (!sensorId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${apiUrl}/history/${sensorId}`);
      if (!response.ok) throw new Error('Failed to fetch historical data');
      
      const data = await response.json();
      setHistoricalData(data.history || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sensorId, apiUrl]);

  // Simple linear regression for time series prediction
  const predictTrend = async (data, steps = 5) => {
    if (data.length < 5) {
      throw new Error('Insufficient data for prediction (minimum 5 data points required)');
    }

    try {
      // Prepare data for training
      const values = data.map(d => parseFloat(d.value));
      const times = data.map((_, i) => i);
      
      // Normalize data
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
      const normalizedValues = values.map(v => (v - mean) / std);
      
      // Create tensors
      const xs = tf.tensor2d(times.map(t => [t]), [times.length, 1]);
      const ys = tf.tensor2d(normalizedValues, [values.length, 1]);
      
      // Simple linear model
      const model = tf.sequential({
        layers: [
          tf.layers.dense({ units: 1, inputShape: [1] })
        ]
      });
      
      model.compile({ optimizer: tf.train.adam(0.1), loss: 'meanSquaredError' });
      
      // Train the model
      await model.fit(xs, ys, {
        epochs: 50,
        verbose: 0,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (logs.loss < 0.01) {
              model.stopTraining = true;
            }
          }
        }
      });
      
      // Make predictions
      const futureTimes = Array.from({ length: steps }, (_, i) => [times.length + i]);
      const futureXs = tf.tensor2d(futureTimes, [steps, 1]);
      const predictions = model.predict(futureXs);
      const predictedValues = await predictions.array();
      
      // Denormalize predictions
      const denormalizedPredictions = predictedValues.map(p => p[0] * std + mean);
      
      // Clean up tensors
      xs.dispose();
      ys.dispose();
      futureXs.dispose();
      predictions.dispose();
      model.dispose();
      
      return denormalizedPredictions;
    } catch (err) {
      throw new Error('Prediction failed: ' + err.message);
    }
  };

  // Generate predictions
  const generatePredictions = async () => {
    if (historicalData.length < 5) {
      setError('Insufficient historical data for prediction');
      return;
    }

    try {
      setLoading(true);
      const predictedValues = await predictTrend(historicalData);
      
      // Create prediction objects with timestamps
      const lastTimestamp = new Date(historicalData[historicalData.length - 1].timestamp);
      const predictionData = predictedValues.map((value, index) => ({
        timestamp: new Date(lastTimestamp.getTime() + (index + 1) * 60000).toISOString(),
        value: Math.round(value * 100) / 100,
        predicted: true
      }));
      
      setPredictions(predictionData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [fetchHistoricalData]);

  // Chart configuration
  const chartData = {
    datasets: [
      {
        label: 'Historical Data',
        data: historicalData.map(d => ({
          x: new Date(d.timestamp),
          y: parseFloat(d.value)
        })),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      },
      {
        label: 'Predicted Trend',
        data: predictions.map(p => ({
          x: new Date(p.timestamp),
          y: p.value
        })),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderDash: [5, 5],
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          displayFormats: {
            minute: 'HH:mm'
          }
        },
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Value'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const date = new Date(context[0].parsed.x);
            return date.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div className="predictive-analytics">
      <h3>Predictive Analytics</h3>
      
      <div className="analytics-controls">
        <button 
          onClick={generatePredictions} 
          disabled={loading || historicalData.length < 5}
          className="btn btn-primary"
        >
          {loading ? 'Generating...' : 'Generate Predictions'}
        </button>
        
        {historicalData.length < 5 && (
          <small className="text-muted">
            Need at least 5 data points for predictions
          </small>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {predictions.length > 0 && (
        <div className="predictions-summary">
          <h5>Next {predictions.length} Predictions:</h5>
          <ul>
            {predictions.map((pred, index) => (
              <li key={index}>
                {new Date(pred.timestamp).toLocaleTimeString()}: {pred.value}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="chart-container" style={{ height: '300px', marginTop: '20px' }}>
        {historicalData.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="text-center text-muted">
            {loading ? 'Loading historical data...' : 'No data available'}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictiveAnalytics;