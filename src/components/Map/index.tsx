import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import UserSettings from "../UserSettings";
import Legend from "../Legend";
import Loader from "../Loader";
import AreaDetails from "../AreaDetails";
import geoJsonDataService from "../../services/geoJsonData";
import utils from "../../utils";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
mapboxgl.workerClass =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const Map = () => {
  const mapContainerRef: React.MutableRefObject<HTMLDivElement> = useRef(null); // used to create the map on page load
  const hoveredAreaRef: React.MutableRefObject<string | number> = useRef(null); // used to create the popup hover effect
  const mapObjectRef = useRef(null); // stores the map object

  const [areaLevel, setAreaLevel]: [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ] = useState(4); // country(4), region(5), county(6), district(7)

  const [industry, setIndustry]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState("01-03 : Agriculture, forestry & fishing"); // broad industry groups

  const industryRef: React.MutableRefObject<string> = useRef(industry); // used in mousemove callback to always uses the latest industry

  const [geoJsonData, setGeoJsonData] = useState(null); // data from server

  const [colourInterpolations, setColourInterpolations] = useState([
    500,
    "#4976b5",
    1000,
    "#49a9bf",
    5000,
    "#49c7ad",
    10000,
    "#4ad07e",
    15000,
    "#4dd74b",
    20000,
    "#88df4d",
    25000,
    "#c8e64f",
    100000,
    "#eccd52",
    300000,
    "#f29455",
    500000,
    "#f75959",
  ]);

  const [isLoading, setLoading]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState(false); // used to render the loader component

  const [selectedArea, setSelectedArea] = useState(null); // populated when a user clicks on an area

  // callback function to get geoJSON data from server
  // updates the map source with the new geoJSON data
  const updateGeoJsonData = async (newAreaLevel: number) => {
    setLoading(true);
    const data = await geoJsonDataService.getData(newAreaLevel);
    setGeoJsonData(data);
    if (mapObjectRef.current) {
      const _map = mapObjectRef.current;
      if (_map.getSource("countries-source")) {
        _map.getSource("countries-source").setData(data);
      }
    }
    setLoading(false);
  };

  // Update the colour scale based on the max number of businesses
  useEffect(() => {
    if (geoJsonData) {
      const newMaxBusinesses = geoJsonData.features.reduce((prev, cur) =>
        prev.properties[industry] > cur.properties[industry] ? prev : cur
      ).properties[industry];

      const interpolationDistance =
        Math.ceil(Math.round(newMaxBusinesses / 9) / 100) * 100;

      const newInterpolations = colourInterpolations.map((el, idx) =>
        idx % 2 === 0 ? (idx / 2) * interpolationDistance : el
      );

      setColourInterpolations(newInterpolations);

      mapObjectRef.current.setPaintProperty("countries-layer", "fill-color", [
        "interpolate",
        ["linear"],
        ["get", industry],
        ...newInterpolations,
      ]);
    }
  }, [geoJsonData, industry]);

  // Runs on page load
  // Sets up the map source and layer and related callback functions
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [-3.0803, 55.7186],
      zoom: 5,
    });
    mapObjectRef.current = map;

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
          popup
            .setLngLat(coordinates)
            .setHTML(popupData)
            .addTo(mapObjectRef.current);
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

      // When an area is clicked, save it to selectedArea to display in AreaDetails component
      map.on("click", "countries-layer", (e) => setSelectedArea(e.features[0]));
    });
  }, []);

  return (
    <div>
      <UserSettings
        areaLevel={areaLevel}
        setAreaLevel={setAreaLevel}
        updateGeoJsonData={updateGeoJsonData}
        industry={industry}
        setIndustry={setIndustry}
        mapObjectRef={mapObjectRef}
        industryRef={industryRef}
      />
      <Legend interpolations={colourInterpolations} />
      {isLoading && <Loader />}
      {selectedArea && <AreaDetails area={selectedArea} />}
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};

export default Map;
