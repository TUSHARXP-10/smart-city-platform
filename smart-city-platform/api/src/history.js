export class SensorHistory {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const sensorId = this.state.id.toString();

    if (request.method === "POST" && path === "/history") {
      const { value, unit } = await request.json();
      const timestamp = Date.now();
      let history = (await this.state.storage.get("data")) || [];
      history.push({ timestamp, value, unit });
      // Keep only last 100 entries
      if (history.length > 100) history.shift();
      await this.state.storage.put("data", history);
      return new Response("OK", { status: 200 });
    }

    if (request.method === "GET" && path === "/history") {
      const history = (await this.state.storage.get("data")) || [];
      return new Response(JSON.stringify(history), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Not Found", { status: 404 });
  }
}