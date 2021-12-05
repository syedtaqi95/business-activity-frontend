import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import utils from "../../utils";

interface Props {
  geoJsonData: GeoJSON.FeatureCollection;
  areaLevel: number;
  industry: string;
  colourInterpolations: (string | number)[];
  setColourInterpolations: React.Dispatch<
    React.SetStateAction<(string | number)[]>
  >;
  mapObjectRef: React.MutableRefObject<mapboxgl.Map | null>;
  updateGeoJsonData: (newAreaLevel: number) => Promise<void>;
  industryRef: React.MutableRefObject<string>;
  setSelectedArea: React.Dispatch<mapboxgl.MapboxGeoJSONFeature>;
}

const Map = ({
  geoJsonData,
  areaLevel,
  industry,
  colourInterpolations,
  setColourInterpolations,
  mapObjectRef,
  updateGeoJsonData,
  industryRef,
  setSelectedArea,
}: Props) => {
  const mapContainerRef: React.MutableRefObject<HTMLDivElement | null> =
    useRef(null); // used to create the map on page load
  const hoveredAreaRef: React.MutableRefObject<string | number | null> =
    useRef(null); // used to create the popup hover effect

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

      mapObjectRef.current.setPaintProperty("geojson-layer", "fill-color", [
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
      map.addSource("geojson-source", {
        type: "geojson",
        data: geoJsonData as
          | GeoJSON.Feature<GeoJSON.Geometry>
          | GeoJSON.FeatureCollection<GeoJSON.Geometry>
          | string,
        generateId: true,
      });

      map.addLayer({
        id: "geojson-layer",
        type: "fill",
        source: "geojson-source",
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

      map.on("mousemove", "geojson-layer", (e) => {
        if (e.features.length > 0) {
          // When the user moves their mouse over an area, we'll update the
          // feature state for the feature under the mouse.
          if (hoveredAreaRef.current > -1) {
            map.setFeatureState(
              { source: "geojson-source", id: hoveredAreaRef.current },
              { hover: false }
            );
          }

          const _hoveredArea = e.features[0].id;
          map.setFeatureState(
            { source: "geojson-source", id: _hoveredArea },
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

      map.on("mouseleave", "geojson-layer", () => {
        // When the mouse leaves the state-fill layer, update the feature state of the
        // previously hovered feature.
        if (hoveredAreaRef.current > -1) {
          map.setFeatureState(
            { source: "geojson-source", id: hoveredAreaRef.current },
            { hover: false }
          );
        }
        hoveredAreaRef.current = null;

        // Remove the popup and reset the cursor
        map.getCanvas().style.cursor = "";
        popup.remove();
      });

      // When an area is clicked, save it to selectedArea to display in AreaDetails component
      map.on("click", "geojson-layer", (e) => setSelectedArea(e.features[0]));
    });
  }, []);

  return (
    <div>
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};

export default Map;
