# Smart City Platform

A modern platform for smart city solutions with real-time sensor data monitoring.

## Features

- **Real-Time Sensor Dashboard**: Monitor air quality, traffic, and noise levels across the city
- **Automatic Data Refresh**: Live updates every 10 seconds
- **Visual Status Indicators**: Color-coded status for quick assessment
- **Responsive Design**: Works on desktop and mobile devices
- **Data Persistence**: Historical sensor data stored using Cloudflare Durable Objects
- **Historical Charts**: Interactive time-series charts showing sensor reading history
- **Threshold Alerts**: Real-time notifications when sensors exceed warning or critical thresholds

## Project Setup

### Prerequisites

- Node.js and npm
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/smart-city-platform.git
   cd smart-city-platform
   ```

2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Deployment

### Cloudflare Pages

1. Sign up at https://dash.cloudflare.com/register (no credit card required).
2. In the Cloudflare dashboard, select **Pages** → **Create a Project**.
3. Connect your GitHub account, authorize access to **smart-city-platform**.
4. For the build settings:
   - Framework: **Create React App**
   - Build command: `npm run build`
   - Build output directory: `frontend/build`
5. Click **Deploy**—Cloudflare will build and publish your site.

## Project Structure

```
smart-city-platform/
├── frontend/           # React frontend application
│   ├── public/         # Static files
│   └── src/            # React source code
├── api/                # Cloudflare Worker API
│   ├── src/            # API source code
│   │   ├── config.js   # Threshold configuration
│   │   ├── history.js  # Durable Object for sensor history
│   │   └── index.js    # Main API worker code
│   └── wrangler.toml   # Cloudflare Worker configuration
├── alert-processor/    # Alert processing worker
│   ├── src/            # Alert processor source code
│   └── wrangler.toml   # Alert worker configuration
└── README.md           # Project documentation
```

## API

### Cloudflare Workers

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Authenticate with Cloudflare:
   ```bash
   wrangler login
   ```

3. Deploy the API and alert processor:
   ```bash
   # Deploy the main API worker
   cd api
   wrangler publish
   
   # Deploy the alert processor worker
   cd ../alert-processor
   wrangler publish
   ```

4. Test the API endpoints:

   **Main endpoint:**
   ```bash
   curl https://smart-city-api.your-subdomain.workers.dev
   ```
   
   **Sensors list:**
   ```bash
   curl https://smart-city-api.your-subdomain.workers.dev/sensors
   ```
   
   **Sensor data:**
   ```bash
   curl https://smart-city-api.your-subdomain.workers.dev/sensors/data
   ```
   
   **Sensor history:**
   ```bash
   curl https://smart-city-api.your-subdomain.workers.dev/history/air_quality_001
   ```
   
   **Alerts endpoint:**
   ```bash
   curl https://smart-city-api.your-subdomain.workers.dev/alerts
   ```
   
   Example response from sensors/data:
   ```json
   {
     "data": [
       {
         "id": "air_quality_001",
         "type": "air_quality",
         "location": { "lat": 28.6139, "lng": 77.2090, "name": "Connaught Place" },
         "value": 75,
         "unit": "AQI",
         "timestamp": 1693470000000,
         "status": "active"
       },
       // More sensor data...
     ],
     "timestamp": 1693470000000
   }
   ```

## Real-Time Sensor Dashboard

The Smart City Platform includes a real-time dashboard for monitoring sensor data across the city:

### Dashboard Features

- **Live Monitoring**: View real-time data from multiple sensors
- **Automatic Updates**: Data refreshes every 10 seconds automatically
- **Status Indicators**: Color-coded indicators show sensor status at a glance:
  - Green: Normal readings
  - Orange: Elevated readings (Warning threshold)
  - Red: Critical readings (Critical threshold)
- **Sensor Details**: Each sensor card displays:
  - Current reading value and unit
  - Sensor location
  - Last update timestamp
- **Historical Data**: Click on any sensor card to view its historical data chart
- **Time-Series Visualization**: Interactive charts showing the last 100 readings for each sensor
- **Alert Notifications**: Toast notifications appear when sensors exceed warning or critical thresholds

### Using the Dashboard

1. Navigate to the main application URL
2. The dashboard is displayed by default
3. Switch between "Dashboard" and "API Status" using the navigation buttons
4. View detailed information about each sensor in its respective card
5. Data automatically refreshes every 10 seconds
6. Click on any sensor card to view its historical data chart
7. Historical charts display the last 100 readings for the selected sensor

## Data Persistence Architecture

The Smart City Platform uses Cloudflare Durable Objects for efficient time-series data storage:

### Storage Design

- **Durable Objects**: Each sensor has its own Durable Object instance for storing historical readings
- **Data Structure**: Time-series data stored as JSON arrays with timestamp, value, and unit
- **Retention Policy**: Each sensor stores its last 100 readings
- **Access Pattern**: Data is automatically recorded with each sensor reading and can be retrieved on demand

### API Integration

- **Automatic Recording**: Each sensor reading is automatically stored in its corresponding Durable Object
- **History Endpoint**: Access historical data for any sensor via the `/history/:sensorId` endpoint
- **Frontend Integration**: Historical charts are displayed when clicking on a sensor card

## Threshold Alerts Architecture

The platform includes a real-time alert system for monitoring critical sensor readings:

### Alert Configuration

- **Threshold Definitions**: Each sensor type has defined warning and critical thresholds
- **Configuration File**: Thresholds are centrally defined in `api/src/config.js`
- **Sensor Types**: Configured thresholds for air quality, traffic, and noise sensors

### Alert Processing

- **Threshold Checking**: Each sensor reading is automatically checked against thresholds
- **Cloudflare Queues**: Alerts are dispatched to a dedicated queue for processing
- **Alert Worker**: A separate worker processes alerts from the queue
- **Notification Delivery**: Alerts can be sent to external systems via webhooks

### Frontend Notifications

- **Toast Notifications**: Real-time toast notifications appear when thresholds are exceeded
- **Visual Indicators**: Notifications are color-coded by severity (warning or critical)
- **Alert Details**: Each notification includes sensor ID, reading value, and timestamp
- **React Integration**: Built using react-toastify for a smooth user experience

## License

MIT