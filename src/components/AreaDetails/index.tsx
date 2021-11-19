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
      <h2>📍 {area.properties.name}</h2>
      <table>
        {Object.keys(filteredProperties).map((property) => {
          return (
            <tr key={property}>
              <td>{property}</td>
              <td>{utils.numberWithCommas(filteredProperties[property])}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default index;
