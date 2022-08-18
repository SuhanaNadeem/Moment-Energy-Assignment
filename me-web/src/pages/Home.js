// Chart Docs: https://www.react-google-charts.com/examples/line-chart
import React, { useEffect, useState } from "react";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { FaCaretDown, FaRedo } from "react-icons/fa";

import { Chart } from "react-google-charts";

export default function Home() {
  const options = {
    title: "Time vs. Voltage",
    curveType: "function",
    legend: { position: "bottom" },
    chartArea: {
      left: 60,
      top: 60,
      right: 20,
      width: "100%",
      height: "60%",
    },
  };
  const [timeRange, setTimeRange] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [refreshClicked, setRefreshClicked] = useState(null);

  function toggleIsOpen(e) {
    e.preventDefault();
    setIsOpen(!isOpen);
  }
  const [chartData, setChartData] = useState(null);

  const timeRanges = ["1m", "15m", "1h", "6h", "12h"];
  const [
    getVoltageMeasurementsByTimeRange,
    { data: { getVoltageMeasurementsByTimeRange: data } = {} },
  ] = useLazyQuery(GET_VOLTAGE_MEASUREMENTS_BY_TIME_RANGE);

  useEffect(() => {
    if (timeRange && refreshClicked) {
      getVoltageMeasurementsByTimeRange({
        variables: { timeRange },
      });
      setRefreshClicked(false); // must click the button again to reload
    }
  }, [
    timeRange,
    setTimeRange,
    refreshClicked,
    setRefreshClicked,
    getVoltageMeasurementsByTimeRange,
  ]);

  // const { data: { getVoltageMeasurementsByTimeRange: data } = {} } = useQuery(
  //   GET_VOLTAGE_MEASUREMENTS_BY_TIME_RANGE,
  //   {
  //     variables: { timeRange: "1m" },
  //     onError(err) {
  //       console.log("getVoltageMeasurementsByTimeRange Error!");
  //       console.log(err);
  //     },
  //   }
  // );

  useEffect(() => {
    if (data) {
      // Parse the voltage values as integers and add the title of the axes
      let temp = data.map((x) => [x[0], parseInt(x[1])]);
      temp.unshift(["Time", "Voltage"]);
      setChartData(temp);
    }
  }, [data]);

  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex gap-8 ml-4">
        {/* Dropdown */}
        <>
          <button
            onClick={toggleIsOpen}
            className="flex justify-between items-center border border-blue-800 shadow-md rounded w-1/6 text-left appearance-none py-1 px-2 focus:outline-none"
          >
            {timeRange ? <p>{timeRange}</p> : <p>Time Range</p>}
            <FaCaretDown />
          </button>
          {isOpen ? (
            <>
              <button
                tabIndex="-1"
                onClick={toggleIsOpen}
                className="fixed inset-0 h-full w-full bg-transparent cursor-default z-20 focus:outline-none"
              ></button>
              <div className="absolute focus:outline-none left-50 w-1/5 mt-1 ml-1 py-1 bg-white rounded-lg shadow-xl text-sm z-20 overflow-y-auto">
                {timeRanges.map((timeRange, index) => (
                  <button
                    onClick={(e) => {
                      toggleIsOpen(e);
                      setTimeRange(timeRange);
                    }}
                    key={index}
                    type="button"
                    className="focus:outline-none text-left w-full block px-2 py-1 text-gray-800 hover:text-white hover:bg-blue-800"
                  >
                    {timeRange}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <></>
          )}
        </>
        <button
          onClick={(e) => {
            setRefreshClicked(true);
          }}
        >
          <FaRedo />
        </button>
      </div>

      {/* Chart */}
      {chartData && (
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={chartData}
          options={options}
        />
      )}
    </div>
  );
}

export const GET_VOLTAGE_MEASUREMENTS_BY_TIME_RANGE = gql`
  query getVoltageMeasurementsByTimeRange($timeRange: String!) {
    getVoltageMeasurementsByTimeRange(timeRange: $timeRange)
  }
`;
