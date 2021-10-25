import React, { useState, useEffect } from "react";
import industryGroupsService from "../../services/industryGroups";

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
  const [industryGroups, setIndustryGroups] = useState(null);

  useEffect(() => {
    industryGroupsService.getAll().then((data) => {
      setIndustryGroups(data);
    });
  }, []);

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
          {industryGroups
            ? industryGroups.map((group: string, idx: number) => (
                <option key={idx} value={group}>
                  {group}
                </option>
              ))
            : null}
        </select>
      </p>
      <p>Current industry: {industry}</p>
    </div>
  );
};

export default UserSettings;
