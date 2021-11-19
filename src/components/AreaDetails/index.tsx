import { MapboxGeoJSONFeature } from "mapbox-gl";
import React from "react";
import "./AreaDetails.css";
import utils from "../../utils";

interface Props {
  area: MapboxGeoJSONFeature;
}

const index = ({ area }: Props) => {
  const filteredProperties = Object.keys(area.properties)
    .filter((key) => key !== "name" && key !== "id")
    .reduce((obj, key) => {
      obj[key] = area.properties[key];
      return obj;
    }, {});

  console.log(filteredProperties);

  return (
    <div className="area-details">
      <h2>{area.properties.name}</h2>
      {Object.keys(filteredProperties).map((property) => {
        return (
          <div key={property}>
            {property}: {utils.numberWithCommas(filteredProperties[property])}
          </div>
        );
      })}
    </div>
  );
};

export default index;
