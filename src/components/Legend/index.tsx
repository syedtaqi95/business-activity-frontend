import React from "react";
import "./Legend.css";
import utils from "../../utils";

interface Props {
  interpolations: (string | number)[];
}

const Legend = ({ interpolations }: Props) => {
  const numbers: number[] = [];
  const colors: string[] = [];

  interpolations.map((val, i) => {
    if (i % 2 === 0) {
      numbers.push(val as number);
    } else colors.push(val as string);
  });

  return (
    <div id="legend">
      {numbers.map((business, i) => {
        return (
          <div key={i}>
            <span className="legend-key" style={{ backgroundColor: colors[i] }}>
              {" "}
            </span>
            <span>{utils.numberWithCommas(business)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Legend;
