import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import geoJsonData from "../../data/ukgeography.json";
import AreaSelector from "../AreaSelector";

mapboxgl.accessToken =
  process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ||
  "pk.eyJ1Ijoic3llZHRhcWk5NSIsImEiOiJja3Vqbm5icHYwbG96Mm9ydnk1cnJlaDZrIn0.qQV61Wku6oqtKMj_Oa-Lew";

const Map = () => {
  const mapContainerRef = useRef(null);

  const [hoveredArea, _setHoveredArea]: [
    string | number,
    React.Dispatch<string | number>
  ] = useState(null);
  const hoveredAreaRef = useRef(hoveredArea);

  const [areaLevel, setAreaLevel]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState("country"); // country, county, district

  const setHoveredArea = (data: string | number) => {
    hoveredAreaRef.current = data;
    _setHoveredArea(data);
  };

  useEffect(() => {
    // Initialize map when component mounts
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [-3.0803, 55.7186],
      zoom: 5,
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      // Add the geoJSON data as a source and layer
      map.addSource("countries-source", {
        type: "geojson",
        data: geoJsonData as
          | GeoJSON.Feature<GeoJSON.Geometry>
          | GeoJSON.FeatureCollection<GeoJSON.Geometry>
          | string,
        generateId: true,
      });

      map.addLayer({
        id: "countries-layer",
        type: "fill",
        source: "countries-source",
        layout: {},
        paint: {
          "fill-color": "#5AA5D7",
          "fill-outline-color": "#FFFFFF",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.9,
            0.1,
          ],
        },
      });

      // Create a popup but don't add it to the map yet.
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.on("mousemove", "countries-layer", (e) => {
        if (e.features.length > 0) {
          // When the user moves their mouse over an area, we'll update the
          // feature state for the feature under the mouse.
          if (hoveredAreaRef.current > -1) {
            map.setFeatureState(
              { source: "countries-source", id: hoveredAreaRef.current },
              { hover: false }
            );
          }

          const _hoveredArea = e.features[0].id;
          map.setFeatureState(
            { source: "countries-source", id: _hoveredArea },
            { hover: true }
          );

          setHoveredArea(_hoveredArea);

          // Change the cursor style as a UI indicator.
          map.getCanvas().style.cursor = "pointer";

          // Get the pointer coordinates
          const coordinates: mapboxgl.LngLat = e.lngLat;
          const popupData = `
            <strong>${e.features[0].properties.CTRY20NM}</strong>
            <div>Business enterprises: 4,200,000</div>
            `;

          // Populate the popup and set its coordinates
          // based on the feature found.
          popup.setLngLat(coordinates).setHTML(popupData).addTo(map);
        }
      });

      map.on("mouseleave", "countries-layer", () => {
        // When the mouse leaves the state-fill layer, update the feature state of the
        // previously hovered feature.
        if (hoveredAreaRef.current > -1) {
          map.setFeatureState(
            { source: "countries-source", id: hoveredAreaRef.current },
            { hover: false }
          );
        }
        setHoveredArea(null);

        // Remove the popup and reset the cursor
        map.getCanvas().style.cursor = "";
        popup.remove();
      });
    });
  }, []);

  return (
    <div>
      <div className="sidebarStyle">
        <h2>💵 UK Business Activity Visualiser</h2>
        <p>
          Hover over an area to display information about its business
          enterprises
        </p>
        <AreaSelector areaLevel={areaLevel} setAreaLevel={setAreaLevel} />
      </div>
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};

export default Map;
