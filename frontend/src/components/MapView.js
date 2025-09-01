import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { TILE_PROVIDERS, ERROR_TILE_URL, DEFAULT_TILE_PROVIDER } from '../utils/mapConfig';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const HeatmapLayer = ({ sensors, showHeatmap }) => {
  const map = useMap();
  const heatLayerRef = useRef(null);

  useEffect(() => {
    if (!showHeatmap) {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
      return;
    }

    if (sensors && sensors.length > 0) {
      const heatPoints = sensors.map(sensor => [
        sensor.location.lat,
        sensor.location.lng,
        sensor.value || 1
      ]);

      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }

      heatLayerRef.current = L.heatLayer(heatPoints, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.0: '#0000ff',
          0.2: '#00ff00',
          0.4: '#ffff00',
          0.6: '#ff7f00',
          0.8: '#ff0000',
          1.0: '#8b0000'
        }
      }).addTo(map);
    }

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [map, sensors, showHeatmap]);

  return null;
};

export default function MapView({ sensors = [], center = [28.6139, 77.2090], zoom = 11 }) {
  const [selectedProvider, setSelectedProvider] = useState(DEFAULT_TILE_PROVIDER);
  const [tileError, setTileError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [currentProviderKey, setCurrentProviderKey] = useState(DEFAULT_TILE_PROVIDER);
  const [isLoading, setIsLoading] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const providerOrder = ['openstreetmap', 'cartodb', 'cartodb_dark', 'stadia_light', 'stadia_dark', 'stamen_toner', 'stamen_watercolor'];
  
  const currentProvider = TILE_PROVIDERS[currentProviderKey];

  const handleProviderChange = (e) => {
    const newProvider = e.target.value;
    setSelectedProvider(newProvider);
    setCurrentProviderKey(newProvider);
    setTileError(false);
    setRetryCount(0);
  };

  const handleTileError = () => {
    setTileError(true);
    
    // Auto-fallback to next provider on error
    if (retryCount < providerOrder.length - 1) {
      const currentIndex = providerOrder.indexOf(currentProviderKey);
      const nextIndex = (currentIndex + 1) % providerOrder.length;
      const nextProvider = providerOrder[nextIndex];
      
      setTimeout(() => {
        setCurrentProviderKey(nextProvider);
        setRetryCount(retryCount + 1);
        setTileError(false);
      }, 1000); // 1 second delay before retry
    }
  };

  const handleTileLoad = () => {
    setTileError(false);
    setRetryCount(0);
    setIsLoading(false);
  };



  return (
    <div className="map-container">
      <div className="map-controls">
          <div className="map-provider-selector">
            <label htmlFor="tile-provider">Map Style: </label>
            <select
              id="tile-provider"
              value={selectedProvider}
              onChange={handleProviderChange}
              disabled={isLoading}
            >
              {Object.entries(TILE_PROVIDERS).map(([key, provider]) => (
                <option key={key} value={key}>
                  {provider.name}
                </option>
              ))}
            </select>
            {currentProviderKey !== selectedProvider && (
              <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
                (Auto fallback to {TILE_PROVIDERS[currentProviderKey].name})
              </span>
            )}
          </div>
          <div className="map-heatmap-toggle">
            <label>
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
              />
              Show Heatmap
            </label>
            {showHeatmap && (
              <div className="heatmap-legend">
                <div className="legend-title">Sensor Intensity</div>
                <div className="legend-scale">
                  <div className="legend-item">
                    <div className="legend-color" style={{backgroundColor: '#0000ff'}}></div>
                    <span>Low</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{backgroundColor: '#ffff00'}}></div>
                    <span>Medium</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{backgroundColor: '#ff0000'}}></div>
                    <span>High</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {isLoading && (
            <div className="map-loading-indicator">
              🗺️ Loading map...
            </div>
          )}
          {tileError && retryCount > 0 && (
            <div className="map-error-indicator">
              ⚠️ Retrying with {TILE_PROVIDERS[currentProviderKey].name}...
            </div>
          )}
        </div>
      <MapContainer 
        center={center} 
        zoom={11} 
        style={{ height: '400px', width: '100%' }}
        key={`map-${selectedProvider}`}
      >
        <TileLayer
          key={currentProviderKey}
          url={currentProvider.url}
          attribution={currentProvider.attribution}
          maxZoom={currentProvider.maxZoom}
          {...(currentProvider.subdomains && { subdomains: currentProvider.subdomains })}
          errorTileUrl={ERROR_TILE_URL}
          eventHandlers={{
            tileerror: handleTileError,
            tileload: handleTileLoad,
            load: handleTileLoad
          }}
        />
        <HeatmapLayer sensors={sensors} showHeatmap={showHeatmap} />
        {sensors && sensors.map && sensors.map(sensor => (
          <Marker
            key={sensor.id}
            position={[sensor.location.lat, sensor.location.lng]}
          >
            <Popup>
              <strong>{sensor.type.replace('_', ' ').toUpperCase()}</strong><br/>
              {sensor.value} {sensor.unit}<br/>
              {sensor.location.name}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}