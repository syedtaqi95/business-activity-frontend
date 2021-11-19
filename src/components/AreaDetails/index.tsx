import { MapboxGeoJSONFeature } from "mapbox-gl";
import React from "react";
import "./AreaDetails.css";
import utils from "../../utils";

interface Props {
  area: MapboxGeoJSONFeature;
  setSelectedArea: React.Dispatch<mapboxgl.MapboxGeoJSONFeature>;
}

const index = ({ area, setSelectedArea }: Props) => {
  // Remove the name and id from the properties object
  const filteredProperties = Object.keys(area.properties).filter(
    (key) => key !== "name" && key !== "id"
  );

  return (
    <div className="area-details">
      <h2>
        <u>📍 {area.properties.name}</u>
        <button
          className="close-button"
          onClick={() => setSelectedArea(null)}
        >X</button>
      </h2>
      <table>
        {filteredProperties.map((property) => {
          return (
            <tr key={property}>
              <td>{property}</td>
              <td>{utils.numberWithCommas(area.properties[property])}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default index;
