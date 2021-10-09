import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import countriesGeoJSON from "../../data/countries.json";

mapboxgl.accessToken =
  process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ||
  "pk.eyJ1Ijoic3llZHRhcWk5NSIsImEiOiJja3Vqbm5icHYwbG96Mm9ydnk1cnJlaDZrIn0.qQV61Wku6oqtKMj_Oa-Lew";

const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(-3.0803);
  const [lat, setLat] = useState(55.7186);
  const [zoom, setZoom] = useState(5);

  const [hoveredArea, _setHoveredArea] = useState(null);
  const hoveredAreaRef = useRef(hoveredArea);

  const setHoveredArea = (data) => {
    hoveredAreaRef.current = data;
    _setHoveredArea(data);
  };

  useEffect(() => {
    // Initialize map when component mounts
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [lng, lat],
      zoom: zoom,
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add the geoJSON data
    map.on("load", () => {
      map.addSource("countries-source", {
        type: "geojson",
        data: countriesGeoJSON as any, // TODO fix TS warning
      });

      map.addLayer({
        id: "countries-layer",
        type: "fill",
        source: "countries-source",
        layout: {},
        paint: {
          "fill-color": "#5AA5D7",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.8,
            0.5,
          ],
        },
      });
    });

    map.on("mousemove", "countries-layer", (e) => {
      if (e.features.length > 0) {
        if (hoveredAreaRef.current && hoveredAreaRef.current > -1) {
          map.setFeatureState(
            { source: "countries-source", id: hoveredAreaRef.current },
            { hover: false }
          );
        }

        const _hoveredArea = e.features[0].properties.OBJECTID;
        map.setFeatureState(
          { source: "countries-source", id: _hoveredArea },
          { hover: true }
        );

        setHoveredArea(_hoveredArea);
      }
    });

    // When the mouse leaves the state-fill layer, update the feature state of the
    // previously hovered feature.
    map.on("mouseleave", "countries-layer", function () {
      if (hoveredAreaRef.current) {
        map.setFeatureState(
          { source: "countries-source", id: hoveredAreaRef.current },
          { hover: false }
        );
      }
      setHoveredArea(null);
    });

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
