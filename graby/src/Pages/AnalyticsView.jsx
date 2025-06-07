import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Line } from "react-chartjs-2";
import "leaflet/dist/leaflet.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,  // <-- Register category scale here
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsView = ({ userId }) => {
  const [mapData, setMapData] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], data: [] });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/analytics?user_id=${userId}`);
        const result = await res.json();

        setMapData(result.visitorsByLocation || []);
        setChartData(result.visitorsByDate || { labels: [], data: [] });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, [userId]);

  return (
    <div className="analytics-container p-4">
      <h2 className="text-2xl font-bold mb-4">Visitor Analytics</h2>

      {/* Map Visualization */}
      <div className="map-section mb-6">
        <h3 className="text-lg font-semibold mb-2">Visitor Locations</h3>
        <MapContainer center={[20.5937, 78.9629]} zoom={4} style={{ height: "400px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {mapData.map((loc, index) => (
            <Marker key={index} position={[loc.lat, loc.lng]}>
              <Popup>
                <b>{loc.city}</b> <br />
                Visits: {loc.count}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Chart Visualization */}
      <div className="chart-section">
        <h3 className="text-lg font-semibold mb-2">Visitor Traffic Over Time</h3>
        <Line
          data={{
            labels: chartData.labels,
            datasets: [
              {
                label: "Visitors",
                data: chartData.data,
                borderColor: "#1d4ed8",
                backgroundColor: "rgba(29, 78, 216, 0.2)",
              },
            ],
          }}
        />
      </div>
    </div>
    
  );
};

export default AnalyticsView;
