import React from "react";

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
