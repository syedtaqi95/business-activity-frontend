import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import UserSettings from "../UserSettings";
import geoJsonDataService from "../../services/geoJsonData";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const Map = () => {
  const mapContainerRef = useRef(null); // used to create the map on page load

  const [hoveredArea, _setHoveredArea]: [
    string | number,
    React.Dispatch<string | number>
  ] = useState(null); // used for the hover effect

  const hoveredAreaRef = useRef(hoveredArea);

  const setHoveredArea = (data: string | number) => {
    hoveredAreaRef.current = data;
    _setHoveredArea(data);
  };

  const mapRef = useRef(null); // stores the map object

  const [areaLevel, setAreaLevel]: [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ] = useState(4); // country(4), region(5), county(6), district(7)

  const [industry, setIndustry]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState("01-03 : Agriculture, forestry & fishing"); // broad industry groups

  const [geoJsonData, setGeoJsonData] = useState(null); // data from server

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // callback function to get geoJSON data from server
  // updates the map source with the new geoJSON data
  const getGeoJsonData = () => {
    geoJsonDataService.getData(areaLevel).then((data) => {
      setGeoJsonData(data);

      if (mapRef.current) {
        const _map = mapRef.current;
        if (_map.getSource("countries-source")) {
          _map.getSource("countries-source").setData(data);
        }
      }
    });
  };

  // Runs on page load
  // Sets up the map source and layer and related callback functions
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [-3.0803, 55.7186],
      zoom: 5,
    });
    mapRef.current = map;

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      getGeoJsonData();

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
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", industry],
            0,
            "#F2F12D",
            100,
            "#EED322",
            200,
            "#E6B71E",
            300,
            "#DA9C20",
            400,
            "#CA8323",
            500,
            "#B86B25",
            750,
            "#A25626",
            1000,
            "#8B4225",
            250000,
            "#723122",
          ],
          "fill-outline-color": "#FFFFFF",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.9,
            0.3,
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
            <strong>${e.features[0].properties.name}</strong><br>
            <strong>${industry}:</strong>
            <div>${numberWithCommas(e.features[0].properties[industry])}</div>
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

  // Update geoJSON data when areaLevel changes
  useEffect(() => {
    getGeoJsonData();
  }, [areaLevel]);

  return (
    <div>
      <UserSettings
        areaLevel={areaLevel}
        setAreaLevel={setAreaLevel}
        industry={industry}
        setIndustry={setIndustry}
      />
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};

export default Map;
