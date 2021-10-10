import React, { useState } from "react";

const AreaSelector = () => {
  const [areaLevel, setAreaLevel] = useState("country");

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
      <p>Current level: {areaLevel}</p>
    </div>
  );
};

export default AreaSelector;
