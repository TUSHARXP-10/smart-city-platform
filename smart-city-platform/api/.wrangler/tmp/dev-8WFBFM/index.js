var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-QFqX2p/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// src/history.js
var SensorHistory = class {
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
      let history = await this.state.storage.get("data") || [];
      history.push({ timestamp, value, unit });
      if (history.length > 100)
        history.shift();
      await this.state.storage.put("data", history);
      return new Response("OK", { status: 200 });
    }
    if (request.method === "GET" && path === "/history") {
      const history = await this.state.storage.get("data") || [];
      return new Response(JSON.stringify(history), {
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response("Not Found", { status: 404 });
  }
};
__name(SensorHistory, "SensorHistory");

// src/config.js
var THRESHOLDS = {
  air_quality: { warning: 100, critical: 150 },
  traffic: { warning: 60, critical: 90 },
  noise: { warning: 65, critical: 85 }
};

// src/index.js
var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
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
};
function generateSensorData() {
  return [
    {
      id: "air_quality_001",
      type: "air_quality",
      location: { lat: 28.6139, lng: 77.209, name: "Connaught Place" },
      value: Math.floor(Math.random() * 100 + 50),
      // AQI
      unit: "AQI",
      timestamp: Date.now(),
      status: "active"
    },
    {
      id: "traffic_002",
      type: "traffic",
      location: { lat: 28.5355, lng: 77.391, name: "Noida Sector 18" },
      value: Math.floor(Math.random() * 80 + 20),
      // Vehicle count
      unit: "vehicles/min",
      timestamp: Date.now(),
      status: "active"
    },
    {
      id: "noise_003",
      type: "noise",
      location: { lat: 28.4595, lng: 77.0266, name: "Gurgaon Cyber City" },
      value: Math.floor(Math.random() * 30 + 40),
      // Decibels
      unit: "dB",
      timestamp: Date.now(),
      status: "active"
    }
  ];
}
__name(generateSensorData, "generateSensorData");
async function handleSensors(request, headers) {
  const sensors = [
    { id: "air_quality_001", type: "air_quality", status: "active", location: "Connaught Place" },
    { id: "traffic_002", type: "traffic", status: "active", location: "Noida Sector 18" },
    { id: "noise_003", type: "noise", status: "active", location: "Gurgaon Cyber City" }
  ];
  return new Response(JSON.stringify({ sensors }), { headers });
}
__name(handleSensors, "handleSensors");
async function handleSensorData(request, headers, env) {
  const data = generateSensorData();
  const now = Date.now();
  data.forEach((reading) => {
    const { warning, critical } = THRESHOLDS[reading.type] || {};
    if (warning != null && reading.value >= warning) {
      const level = reading.value >= critical ? "critical" : "warning";
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
__name(handleSensorData, "handleSensorData");
async function handleSensorHistory(request, headers, env) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/");
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
__name(handleSensorHistory, "handleSensorHistory");
async function handleAlerts(request, headers, env) {
  return new Response(JSON.stringify({
    thresholds: THRESHOLDS,
    message: "Alert system active",
    timestamp: Date.now()
  }), { headers });
}
__name(handleAlerts, "handleAlerts");

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-QFqX2p/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-QFqX2p/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  SensorHistory,
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
