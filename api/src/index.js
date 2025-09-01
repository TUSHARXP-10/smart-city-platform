import { SensorHistory } from './history';
import { THRESHOLDS } from './config';

export { SensorHistory };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers for frontend integration
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // API Routes
    if (path === "/") {
      return new Response(JSON.stringify({
        message: "Smart City API is live!",
        timestamp: Date.now(),
        version: "1.0.0"
      }), { headers: corsHeaders });
    }

    if (path === "/sensors") {
      return handleSensors(request, corsHeaders);
    }

    if (path === "/sensors/data") {
      return handleSensorData(request, corsHeaders, env);
    }

    if (path.startsWith("/history/")) {
      return handleSensorHistory(request, corsHeaders, env);
    }

    if (path === "/alerts") {
      return handleAlerts(request, corsHeaders, env);
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
}

// Mock sensor data generator
function generateSensorData() {
  return [
    {
      id: "air_quality_001",
      type: "air_quality",
      location: { lat: 28.6139, lng: 77.2090, name: "Connaught Place" },
      value: Math.floor(Math.random() * 100 + 50), // AQI
      unit: "AQI",
      timestamp: Date.now(),
      status: "active"
    },
    {
      id: "traffic_002", 
      type: "traffic",
      location: { lat: 28.5355, lng: 77.3910, name: "Noida Sector 18" },
      value: Math.floor(Math.random() * 80 + 20), // Vehicle count
      unit: "vehicles/min",
      timestamp: Date.now(),
      status: "active"
    },
    {
      id: "noise_003",
      type: "noise",
      location: { lat: 28.4595, lng: 77.0266, name: "Gurgaon Cyber City" },
      value: Math.floor(Math.random() * 30 + 40), // Decibels
      unit: "dB",
      timestamp: Date.now(),
      status: "active"
    }
  ];
}

async function handleSensors(request, headers) {
  const sensors = [
    { id: "air_quality_001", type: "air_quality", status: "active", location: "Connaught Place" },
    { id: "traffic_002", type: "traffic", status: "active", location: "Noida Sector 18" },
    { id: "noise_003", type: "noise", status: "active", location: "Gurgaon Cyber City" }
  ];
   
  return new Response(JSON.stringify({ sensors }), { headers });
}

async function handleSensorData(request, headers, env) {
  const data = generateSensorData();
  const now = Date.now();

  // Check thresholds and dispatch alerts if needed
  data.forEach(reading => {
    const { warning, critical } = THRESHOLDS[reading.type] || {};
    if (warning != null && reading.value >= warning) {
      const level = reading.value >= critical ? 'critical' : 'warning';
      // Dispatch alert event (will be implemented when queue is set up)
      console.log(`ALERT: ${reading.id} ${level} - ${reading.value}${reading.unit}`);
      if (env.ALERT_QUEUE) {
        env.ALERT_QUEUE.send({ 
          sensor: reading.id, 
          type: reading.type, 
          value: reading.value, 
          level, 
          timestamp: now 
        });
      }
    }
  });

  // Record each reading to Durable Object
  for (const reading of data) {
    const id = env.SENSOR_HISTORY.idFromName(reading.id);
    const obj = env.SENSOR_HISTORY.get(id);
    await obj.fetch(new Request(`${new URL(request.url).origin}/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: reading.value, unit: reading.unit })
    }));
  }

  return new Response(JSON.stringify({ data, timestamp: now }), { headers });
}

async function handleSensorHistory(request, headers, env) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const sensorId = pathParts[pathParts.length - 1];
  
  if (!sensorId) {
    return new Response(JSON.stringify({ error: "Sensor ID is required" }), { 
      status: 400, 
      headers 
    });
  }
  
  const id = env.SENSOR_HISTORY.idFromName(sensorId);
  const obj = env.SENSOR_HISTORY.get(id);
  
  const response = await obj.fetch(new Request(`${url.origin}/history`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }));
  
  const history = await response.json();
  return new Response(JSON.stringify(history), { headers });
}

// Handle alerts endpoint - returns recent alerts or can be used for webhook registration
async function handleAlerts(request, headers, env) {
  // For now, just return the threshold configuration
  // In a real implementation, this could return recent alerts from a database
  // or allow registration of webhook endpoints
  
  return new Response(JSON.stringify({
    thresholds: THRESHOLDS,
    message: "Alert system active",
    timestamp: Date.now()
  }), { headers });
}