import React from "react";
import "./UserSettings.css";

interface Props {
  areaLevel: number;
  setAreaLevel: (value: React.SetStateAction<number>) => void;
  updateGeoJsonData: (newAreaLevel: number) => void;
  industry: string;
  setIndustry: React.Dispatch<React.SetStateAction<string>>;
  mapObjectRef: React.MutableRefObject<mapboxgl.Map>;
  industryRef: React.MutableRefObject<string>;
  isLoading: boolean;
}

const UserSettings = ({
  areaLevel,
  setAreaLevel,
  updateGeoJsonData,
  industry,
  setIndustry,
  industryRef,
  isLoading,
}: Props) => {
  const areaLevels = [
    {
      name: "Country",
      value: 4,
    },
    {
      name: "Region",
      value: 5,
    },
    {
      name: "County",
      value: 6,
    },
    {
      name: "District",
      value: 7,
    },
  ];

  const industryGroups = [
    "01-03 : Agriculture, forestry & fishing",
    "05-39 : Production",
    "41-43 : Construction",
    "45 : Motor trades",
    "46 : Wholesale",
    "47 : Retail",
    "49-53 : Transport & Storage (inc postal)",
    "55-56 : Accommodation & food services",
    "58-63 : Information & communication",
    "64-66 : Finance & insurance",
    "68 : Property",
    "69-75 : Professional, scientific & technical",
    "77-82 : Business administration & support services",
    "84 : Public administration & defence",
    "85 : Education",
    "86-88 : Health",
    "90-99 : Arts, entertainment, recreation & other services",
  ];

  const handleAreaLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAreaLevel = Number(e.target.value);
    setAreaLevel(newAreaLevel);
    updateGeoJsonData(newAreaLevel);
  };

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // update fill-color and popup data when industry changes
    const newIndustry = e.target.value;
    setIndustry(newIndustry);
    industryRef.current = newIndustry;
  };

  return (
    <div className="sidebarStyle">
      <h2>
        <u>💵 UK Business Activity Visualiser</u>
      </h2>
      <p>
        Select an area to display information about its business enterprises
      </p>

      <div>
        <p>
          Select level{" "}
          <select onChange={handleAreaLevelChange} disabled={isLoading}>
            {areaLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.name}
              </option>
            ))}
          </select>
        </p>
        <p>
          Current level:{" "}
          {isLoading
            ? "Loading..."
            : areaLevels.find((areaObj) => areaObj.value === areaLevel).name}
        </p>

        <p>
          Select industry{" "}
          <select onChange={handleIndustryChange} disabled={isLoading}>
            {industryGroups.map((group: string, idx: number) => (
              <option key={idx} value={group}>
                {group}
              </option>
            ))}
          </select>
        </p>
        <p>Current industry:{" "}{isLoading ? "Loading..." : industry}</p>
      </div>
    </div>
  );
};

export default UserSettings;
