// Source: https://www.react-google-charts.com/examples/line-chart
import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";

import { Chart } from "react-google-charts";

// export const data = [
//   ["Year", "Sales", "Expenses"],
//   ["1", 1000, 400],
//   ["2", 1170, 460],
//   ["3", 660, 1120],
//   ["4", 1030, 540],
// ];

export default function Home() {
  const options = {
    title: "Time vs. Voltage",
    curveType: "function",
    legend: { position: "bottom" },
  };
  const [chartData, setChartData] = useState(null);

  const { data: { getVoltageMeasurementsByTimeRange: data } = {} } = useQuery(
    GET_VOLTAGE_MEASUREMENTS_BY_TIME_RANGE,
    {
      variables: { timeRange: "6h" },
      onError(err) {
        console.log("getVoltageMeasurementsByTimeRange Error!");
        console.log(err);
      },
    }
  );

  useEffect(() => {
    if (data) {
      let temp = data.map((x) => [x[0], parseInt(x[1])]);
      temp.unshift(["Time", "Voltage"]);
      setChartData(temp);
    }
  }, [data]);

  console.log("chart data");
  console.log(chartData);

  return chartData ? (
    <div className="flex w-full">
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={chartData}
        options={options}
      />
    </div>
  ) : (
    <></>
  );
}

export const GET_VOLTAGE_MEASUREMENTS_BY_TIME_RANGE = gql`
  query getVoltageMeasurementsByTimeRange($timeRange: String!) {
    getVoltageMeasurementsByTimeRange(timeRange: $timeRange)
  }
`;
