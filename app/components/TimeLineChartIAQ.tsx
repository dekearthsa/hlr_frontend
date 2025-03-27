"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useMemo, useState } from "react";

interface DataPoint {
  id: number;
  strDatetime: string;
  timestamp: string; // e.g. "2025-03-26T18:40:00.000Z"
  VOC: number;
  CO2: number;
  eVOC: number;
  Humid: number;
  Temp: number;
  "PM2.5": number;
  PM10: number;
  CO: number;
}

// Possible fields to chart
interface Props {
  data: DataPoint[];
  selectParam:
    | "VOC"
    | "CO2"
    | "eVOC"
    | "Humid"
    | "Temp"
    | "PM2.5"
    | "PM10"
    | "CO";
}

export default function TimeLineChartIAQ({ data, selectParam }: Props) {
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");

  // 1) Build an array of { time: "HH:mm:ss", paramValue: number }
  const chartData = useMemo(() => {
    return data.map((d) => {
      // Format timestamp to HH:mm:ss
      const timeStr = new Date(d.timestamp).toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      // Pick which field we want as Y-value
      const paramValue =
        selectParam === "VOC"
          ? d.VOC
          : selectParam === "CO2"
          ? d.CO2
          : selectParam === "eVOC"
          ? d.eVOC
          : selectParam === "Humid"
          ? d.Humid
          : selectParam === "Temp"
          ? d.Temp
          : selectParam === "PM2.5"
          ? d["PM2.5"]
          : selectParam === "PM10"
          ? d.PM10
          : d.CO;

      return {
        time: timeStr,
        paramValue,
      };
    });
  }, [data, selectParam]);

  // 2) Filter by startTime/endTime
  const filteredData = useMemo(() => {
    return chartData.filter((entry) => {
      const dateObj = new Date(`1970-01-01T${entry.time}`);
      const hh = String(dateObj.getHours()).padStart(2, "0");
      const mm = String(dateObj.getMinutes()).padStart(2, "0");
      const hhmm = `${hh}:${mm}`;
      return hhmm >= startTime && hhmm <= endTime;
    });
  }, [chartData, startTime, endTime]);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Title */}
      <div className="text-center text-3xl mb-4">{selectParam}</div>

      {/* Time range inputs */}
      <div className="flex gap-4 items-center mb-4">
        <label>
          Start Time:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="ml-2 p-1 border rounded"
          />
        </label>
        <label>
          End Time:
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="ml-2 p-1 border rounded"
          />
        </label>
      </div>

      {/* Single-line chart */}
      <ResponsiveContainer width={1400} height={400}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis
            label={{
              value: selectParam,
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="paramValue"
            name={selectParam}
            stroke="#ffc658"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
