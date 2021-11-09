import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import UserSettings from "../UserSettings";
import Legend from "../Legend";
import geoJsonDataService from "../../services/geoJsonData";
import utils from "../../utils";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
mapboxgl.workerClass =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const Map = () => {
  const mapContainerRef = useRef(null); // used to create the map on page load

  const hoveredAreaRef = useRef(null); // used to create the popup hover effect

  const mapRef = useRef(null); // stores the map object

  const [areaLevel, setAreaLevel]: [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ] = useState(4); // country(4), region(5), county(6), district(7)

  const [industry, setIndustry]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState("01-03 : Agriculture, forestry & fishing"); // broad industry groups

  const industryRef = useRef(industry); // used in mousemove callback to always uses the latest industry

  const [geoJsonData, setGeoJsonData] = useState(null); // data from server

  // callback function to get geoJSON data from server
  // updates the map source with the new geoJSON data
  const updateGeoJsonData = (newAreaLevel: number) => {
    geoJsonDataService.getData(newAreaLevel).then((data) => {
      setGeoJsonData(data);

      if (mapRef.current) {
        const _map = mapRef.current;
        if (_map.getSource("countries-source")) {
          _map.getSource("countries-source").setData(data);
        }
      }
    });
  };

  const colourInterpolations = [
    0,
    "#4d4fa8",
    250,
    "#4b61af",
    500,
    "#4976b5",
    750,
    "#498fba",
    1000,
    "#49a9bf",
    2500,
    "#49c3c2",
    5000,
    "#49c7ad",
    7500,
    "#4acc96",
    10000,
    "#4ad07e",
    12500,
    "#4bd465",
    15000,
    "#4dd74b",
    17500,
    "#6adb4c",
    20000,
    "#88df4d",
    22500,
    "#a8e24e",
    25000,
    "#c8e64f",
    50000,
    "#e9e851",
    100000,
    "#eccd52",
    200000,
    "#efb054",
    300000,
    "#f29455",
    400000,
    "#f47657",
    500000,
    "#f75959",
  ];

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
      updateGeoJsonData(areaLevel);

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
            ...colourInterpolations,
          ],
          "fill-outline-color": "#FFFFFF",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.9,
            0.5,
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

          hoveredAreaRef.current = _hoveredArea;

          // Change the cursor style as a UI indicator.
          map.getCanvas().style.cursor = "pointer";

          // Get the pointer coordinates
          const coordinates: mapboxgl.LngLat = e.lngLat;

          const popupData = `
          <strong>${e.features[0].properties.name}</strong><br>
          <div>${utils.numberWithCommas(
            e.features[0].properties[industryRef.current]
          )}</div>
          `;

          // Populate the popup and set its coordinates
          // based on the feature found.
          popup.setLngLat(coordinates).setHTML(popupData).addTo(mapRef.current);
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
        hoveredAreaRef.current = null;

        // Remove the popup and reset the cursor
        map.getCanvas().style.cursor = "";
        popup.remove();
      });
    });
  }, []);

  // update fill-color and popup data when industry changes
  useEffect(() => {
    if (mapRef.current) {
      const _map = mapRef.current;
      if (_map.getLayer("countries-layer")) {
        _map.setPaintProperty("countries-layer", "fill-color", [
          "interpolate",
          ["linear"],
          ["get", industry],
          ...colourInterpolations,
        ]);
      }
    }

    industryRef.current = industry;
  }, [industry]);

  return (
    <div>
      <UserSettings
        areaLevel={areaLevel}
        setAreaLevel={setAreaLevel}
        updateGeoJsonData={updateGeoJsonData}
        industry={industry}
        setIndustry={setIndustry}
      />
      <Legend interpolations={colourInterpolations} />
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};

export default Map;
