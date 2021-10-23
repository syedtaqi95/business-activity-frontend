import React from "react";
import industryGroups from "../../data/industryGroups.json";

interface Props {
  areaLevel: string;
  setAreaLevel: React.Dispatch<React.SetStateAction<string>>;
  industry: string;
  setIndustry: React.Dispatch<React.SetStateAction<string>>;
}

const UserSettings = ({
  areaLevel,
  setAreaLevel,
  industry,
  setIndustry,
}: Props) => {
  return (
    <div>
      <p>
        Select level{" "}
        <input
          type="radio"
          name="adminRegion"
          value="country"
          onChange={(e) => setAreaLevel(e.target.value)}
          checked={areaLevel === "country"}
        />
        Country
        <input
          type="radio"
          name="adminRegion"
          value="county"
          onChange={(e) => setAreaLevel(e.target.value)}
          checked={areaLevel === "county"}
        />
        County
        <input
          type="radio"
          name="adminRegion"
          value="district"
          onChange={(e) => setAreaLevel(e.target.value)}
          checked={areaLevel === "district"}
        />
        District
      </p>
      <p>Current level: {areaLevel[0].toUpperCase() + areaLevel.slice(1)}</p>
      <p>
        Select industry
        <select id="dropdown" onChange={(e) => setIndustry(e.target.value)}>
          {industryGroups.groups.map((group, idx) => (
            <option key={idx} value={group}>
              {group}
            </option>
          ))}
        </select>
      </p>
      <p>Current industry: {industry}</p>
    </div>
  );
};

export default UserSettings;
