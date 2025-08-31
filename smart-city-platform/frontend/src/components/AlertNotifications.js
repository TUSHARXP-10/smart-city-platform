import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AlertNotifications = ({ apiUrl }) => {
  useEffect(() => {
    // Set up polling for alerts
    const checkForAlerts = async () => {
      try {
        const response = await fetch(`${apiUrl}/alerts`);
        if (!response.ok) throw new Error('Failed to fetch alerts');
        
        const data = await response.json();
        
        // For demo purposes, we'll simulate an alert every few calls
        // In a real app, you would check for new alerts since last poll
        if (Math.random() < 0.3) { // 30% chance of alert for demo
          simulateAlert(data.thresholds);
        }
      } catch (error) {
        console.error('Error checking for alerts:', error);
      }
    };
    
    // Check for alerts every 10 seconds
    const interval = setInterval(checkForAlerts, 10000);
    
    // Initial check
    checkForAlerts();
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);
  
  // Simulate an alert for demonstration purposes
  const simulateAlert = (thresholds) => {
    const sensorTypes = Object.keys(thresholds);
    const randomType = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];
    const { warning, critical } = thresholds[randomType];
    
    // Generate a random value that exceeds the threshold
    const isCritical = Math.random() > 0.5;
    const value = isCritical 
      ? critical + Math.floor(Math.random() * 20) 
      : warning + Math.floor(Math.random() * (critical - warning));
    
    const level = isCritical ? 'critical' : 'warning';
    const sensorId = `${randomType}_00${Math.floor(Math.random() * 3) + 1}`;
    
    showAlertNotification({
      sensor: sensorId,
      type: randomType,
      value,
      level,
      timestamp: Date.now()
    });
  };
  
  // Display a toast notification for an alert
  const showAlertNotification = (alert) => {
    const { sensor, type, value, level, timestamp } = alert;
    const formattedTime = new Date(timestamp).toLocaleTimeString();
    
    const message = (
      <div className="alert-toast">
        <div className="alert-header">
          <span className="alert-icon">
            {type === 'air_quality' ? '🌬️' : type === 'traffic' ? '🚗' : '🔊'}
          </span>
          <span className="alert-level" style={{ color: level === 'critical' ? '#F44336' : '#FF9800' }}>
            {level.toUpperCase()}
          </span>
        </div>
        <div className="alert-content">
          <div><strong>{type.replace('_', ' ')} sensor {sensor}</strong></div>
          <div>Reading: {value} {type === 'air_quality' ? 'AQI' : type === 'traffic' ? 'vehicles/min' : 'dB'}</div>
          <div className="alert-time">{formattedTime}</div>
        </div>
      </div>
    );
    
    toast(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: `alert-toast-${level}`,
    });
  };

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default AlertNotifications;