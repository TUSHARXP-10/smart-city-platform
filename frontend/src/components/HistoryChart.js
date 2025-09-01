import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function HistoryChart({ sensorId, apiUrl }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sensorId) return;
    
    setLoading(true);
    fetch(`${apiUrl}/history/${sensorId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch history data');
        return res.json();
      })
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching sensor history:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [sensorId, apiUrl]);

  if (loading) return <div className="chart-loading">Loading history data...</div>;
  if (error) return <div className="chart-error">Error: {error}</div>;
  if (!history.length) return <div className="chart-empty">No historical data available</div>;

  // Format data for Chart.js
  const labels = history.map(h => {
    const date = new Date(h.timestamp);
    return date.toLocaleTimeString();
  });
  
  const values = history.map(h => h.value);

  const data = {
    labels,
    datasets: [
      {
        label: `${sensorId} History`,
        data: values,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sensor Reading History'
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      }
    }
  };

  return (
    <div className="history-chart">
      <Line data={data} options={options} />
    </div>
  );
}