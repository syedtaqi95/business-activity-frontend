import React from "react";

interface Props {
  areaLevel: number;
  setAreaLevel: React.Dispatch<React.SetStateAction<number>>;
  industry: string;
  setIndustry: React.Dispatch<React.SetStateAction<string>>;
}

const UserSettings = ({
  areaLevel,
  setAreaLevel,
  industry,
  setIndustry,
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

  return (
    <div>
      <p>
        Select level{" "}
        <select onChange={(e) => setAreaLevel(Number(e.target.value))}>
          {areaLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.name}
            </option>
          ))}
        </select>
      </p>
      <p>Current level: {areaLevel}</p>
      <p>
        Select industry{" "}
        <select onChange={(e) => setIndustry(e.target.value)}>
          {industryGroups.map((group: string, idx: number) => (
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
