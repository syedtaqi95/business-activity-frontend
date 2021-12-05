import React from "react";
import "./UserSettings.css";

interface Props {
  areaLevel: number;
  setAreaLevel: (value: React.SetStateAction<number>) => void;
  updateGeoJsonData: (newAreaLevel: number) => void;
  industry: string;
  setIndustry: React.Dispatch<React.SetStateAction<string>>;
  industryRef: React.MutableRefObject<string>;
  isLoading: boolean;
  industryGroups: string[];
}

const UserSettings = ({
  areaLevel,
  setAreaLevel,
  updateGeoJsonData,
  industry,
  setIndustry,
  industryRef,
  isLoading,
  industryGroups,
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
            {industryGroups && industryGroups.map((group: string, idx: number) => (
              <option key={idx} value={group}>
                {group}
              </option>
            ))}
          </select>
        </p>
        <p>Current industry: {isLoading ? "Loading..." : industry}</p>
      </div>
    </div>
  );
};

export default UserSettings;
