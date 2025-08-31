import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import HistoryChart from './components/HistoryChart';
import PredictiveAnalytics from './components/PredictiveAnalytics';
import AlertNotifications from './components/AlertNotifications';
import MapView from './components/MapView';

function App() {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [selectedSensorId, setSelectedSensorId] = useState(null);

  const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8787' : 'https://smart-city-api.your-subdomain.workers.dev';

  const fetchSensorData = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/sensors/data`);
      const result = await response.json();
      setSensorData(result.data);
      setLastUpdate(new Date(result.timestamp));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [fetchSensorData]);

  const getSensorIcon = (type) => {
    switch (type) {
      case 'air_quality': return '🌬️';
      case 'traffic': return '🚗';
      case 'noise': return '🔊';
      default: return '📊';
    }
  };

  const getStatusColor = (type, value) => {
    switch (type) {
      case 'air_quality':
        if (value <= 50) return '#4CAF50'; // Good
        if (value <= 100) return '#FF9800'; // Moderate
        return '#F44336'; // Poor
      case 'traffic':
        if (value <= 30) return '#4CAF50'; // Low
        if (value <= 60) return '#FF9800'; // Medium
        return '#F44336'; // High
      case 'noise':
        if (value <= 50) return '#4CAF50'; // Quiet
        if (value <= 65) return '#FF9800'; // Moderate
        return '#F44336'; // Loud
      default:
        return '#2196F3';
    }
  };

  if (loading) {
    return <div className="loading">Loading Smart City Dashboard...</div>;
  }

  return (
    <div className="App">
      <AlertNotifications apiUrl={API_URL} />
      <header className="App-header">
        <h1>🏙️ Smart City Dashboard</h1>
        <p>Real-time city monitoring system</p>
        {lastUpdate && (
          <div className="last-update">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </header>

      <main className="dashboard">
        <div className="sensor-grid">
          {sensorData.map((sensor) => (
            <div 
              key={sensor.id} 
              className="sensor-card"
              style={{ borderLeft: `4px solid ${getStatusColor(sensor.type, sensor.value)}` }}
              onClick={() => setSelectedSensorId(selectedSensorId === sensor.id ? null : sensor.id)}
            >
              <div className="sensor-header">
                <span className="sensor-icon">{getSensorIcon(sensor.type)}</span>
                <h3>{sensor.type.replace('_', ' ').toUpperCase()}</h3>
              </div>
              
              <div className="sensor-value">
                <span className="value">{sensor.value}</span>
                <span className="unit">{sensor.unit}</span>
              </div>
              
              <div className="sensor-location">
                📍 {sensor.location.name}
              </div>
              
              <div className="sensor-timestamp">
                {new Date(sensor.timestamp).toLocaleTimeString()}
              </div>
              
              {selectedSensorId === sensor.id && (
                <div className="sensor-analytics">
                  <HistoryChart sensorId={sensor.id} apiUrl={API_URL} />
                  <PredictiveAnalytics sensorId={sensor.id} apiUrl={API_URL} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="controls">
          <button onClick={fetchSensorData} className="refresh-btn">
            🔄 Refresh Data
          </button>
        </div>

        <MapView sensors={sensorData} />
      </main>
    </div>
  );
}

export default App;