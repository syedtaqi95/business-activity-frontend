import React from "react";
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";

function App() {
  const Plot = createPlotlyComponent(Plotly);
  return (
    <div>
      <h1>UK Business Activity Visualiser</h1>
      <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "red" },
          },
          { type: "bar", x: [1, 2, 3], y: [2, 5, 3] },
        ]}
        layout={{ width: 320, height: 240, title: "A Fancy Plot" }}
      />
    </div>
  );
}

export default App;
