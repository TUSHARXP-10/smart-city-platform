export default {
  async fetch(request, env, ctx) {
    return new Response("Alert Processor Worker", {
      headers: { "Content-Type": "text/plain" }
    });
  },
  
  async queue(batch, env) {
    for (const message of batch.messages) {
      try {
        // Parse the alert data
        const alert = JSON.parse(message.body);
        
        // Log the alert for debugging
        console.log(`Processing alert: ${alert.sensor} (${alert.type}) - ${alert.level} level at ${alert.value}`);
        
        // Send notification via configured endpoint
        if (env.NOTIFY_ENDPOINT) {
          await notify(alert, env.NOTIFY_ENDPOINT);
        }
      } catch (error) {
        console.error("Error processing alert:", error);
      }
    }
    return { outcome: "success" };
  }
};

async function notify(alert, endpoint) {
  // Format the alert message
  const { sensor, type, value, level, timestamp } = alert;
  const formattedTime = new Date(timestamp).toLocaleString();
  
  // Prepare notification payload
  const payload = {
    title: `Smart City Alert: ${level.toUpperCase()}`,
    message: `Sensor ${sensor} (${type}) reported a ${level} reading of ${value} at ${formattedTime}`,
    data: alert
  };
  
  // Send to notification endpoint
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Notification failed: ${response.status} ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error("Failed to send notification:", error);
    return false;
  }
}