import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";

mapboxgl.accessToken =
  process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ||
  "pk.eyJ1Ijoic3llZHRhcWk5NSIsImEiOiJja3Vqbm5icHYwbG96Mm9ydnk1cnJlaDZrIn0.qQV61Wku6oqtKMj_Oa-Lew";

const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(-3.0803);
  const [lat, setLat] = useState(55.7186);
  const [zoom, setZoom] = useState(5);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [lng, lat],
      zoom: zoom,
    });
    
    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("move", () => {
      setLng(Number(map.getCenter().lng.toFixed(4)));
      setLat(Number(map.getCenter().lat.toFixed(4)));
      setZoom(Number(map.getZoom().toFixed(4)));
    });

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div>
      <div className="sidebarStyle">
        <div>
          <h2>💵 UK Business Activity Visualiser</h2>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};

export default Map;
