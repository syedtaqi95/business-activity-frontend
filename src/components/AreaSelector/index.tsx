import React from "react";

interface Props {
  areaLevel: string;
  setAreaLevel: React.Dispatch<React.SetStateAction<string>>;
}

const AreaSelector = ({ areaLevel, setAreaLevel }: Props) => {
  const handleSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAreaLevel(e.target.value);
  };

  return (
    <div>
      <p>
        Show me{" "}
        <input
          type="radio"
          name="adminRegion"
          value="country"
          onChange={handleSelection}
          checked={areaLevel === "country"}
        />
        Country
        <input
          type="radio"
          name="adminRegion"
          value="county"
          onChange={handleSelection}
          checked={areaLevel === "county"}
        />
        County
        <input
          type="radio"
          name="adminRegion"
          value="district"
          onChange={handleSelection}
          checked={areaLevel === "district"}
        />
        District
      </p>
      <p>Current level: {areaLevel[0].toUpperCase() + areaLevel.slice(1)}</p>
    </div>
  );
};

export default AreaSelector;
