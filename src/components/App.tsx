import React, { useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import Map from "./Map";
import UserSettings from "./UserSettings";
import Legend from "./Legend";
import Loader from "./Loader";
import AreaDetails from "./AreaDetails";
import Footer from "./Footer";
import geoJsonDataService from "../services/geoJsonData";

// Set worker class to fix build issue with webpack
// @ts-ignore
mapboxgl.workerClass =
  // eslint-disable-next-line
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

// Mapbox API access token (public)
if (process.env.REACT_APP_MAPBOX_ACCESS_TOKEN) {
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
}

const App = () => {
  const [areaLevel, setAreaLevel] = useState(4); // country(4), region(5), county(6), district(7)

  const [industry, setIndustry] = useState(
    "01-03 : Agriculture, forestry & fishing"
  ); // broad industry groups

  const [isLoading, setLoading] = useState(false); // used to render the loader component

  const [selectedArea, setSelectedArea]: [
    mapboxgl.MapboxGeoJSONFeature,
    React.Dispatch<React.SetStateAction<mapboxgl.MapboxGeoJSONFeature>>
  ] = useState(null); // populated when a user clicks on an area

  const [geoJsonData, setGeoJsonData]: [
    GeoJSON.FeatureCollection,
    React.Dispatch<React.SetStateAction<GeoJSON.FeatureCollection>>
  ] = useState(null); // data from server

  const mapObjectRef: React.MutableRefObject<mapboxgl.Map | null> =
    useRef(null); // stores the map object

  const industryRef: React.MutableRefObject<string> = useRef(industry); // used in mousemove callback to always uses the latest industry

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

  // callback function to get geoJSON data from server
  // updates the map source with the new geoJSON data
  // Alerts the user if the network request fails
  const updateGeoJsonData = async (newAreaLevel: number) => {
    setLoading(true);
    try {
      const data = await geoJsonDataService.getData(newAreaLevel);
      setGeoJsonData(data);
      if (mapObjectRef.current) {
        const _map = mapObjectRef.current;
        if (_map.getSource("geojson-source")) {
          // @ts-ignore setData will always exist on
          _map.getSource("geojson-source").setData(data);
        }
      }
    } catch (e) {
      alert(e);
    }
    setLoading(false);
  };

  return (
    <div>
      <Map
        geoJsonData={geoJsonData}
        areaLevel={areaLevel}
        industry={industry}
        colourInterpolations={colourInterpolations}
        setColourInterpolations={setColourInterpolations}
        mapObjectRef={mapObjectRef}
        updateGeoJsonData={updateGeoJsonData}
        industryRef={industryRef}
        setSelectedArea={setSelectedArea}
      />
      <UserSettings
        areaLevel={areaLevel}
        setAreaLevel={setAreaLevel}
        updateGeoJsonData={updateGeoJsonData}
        industry={industry}
        setIndustry={setIndustry}
        industryRef={industryRef}
        isLoading={isLoading}
        industryGroups={
          geoJsonData
            ? Object.keys(geoJsonData.features[0].properties).filter(
                (val) => val !== "name" && val !== "id"
              )
            : null
        }
      />
      <Legend interpolations={colourInterpolations} />
      {isLoading && <Loader />}
      {selectedArea && (
        <AreaDetails area={selectedArea} setSelectedArea={setSelectedArea} />
      )}
      <Footer />
    </div>
  );
};

export default App;
