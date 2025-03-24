"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMemo, useState } from "react";

interface DataPoint {
  id: number;
  temp: number;
  humidity: number;
  co2: number;
  device_name: string;
  timestamp: string;
  adjust_co2: number;
}
type GroupedEntry = {
  timestamp: string;
  [device_name: string]: string | number; // เช่น tongdy_1: 36.5
};

interface Props {
  data: DataPoint[];
  selectParam: "temp" | "humid" | "co2" | "adjust_co2";
}

export default function TempLineChart({ data, selectParam }: Props) {
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");

  const filteredData = useMemo(() => {
    return data.filter((d) => {
      const t = new Date(d.timestamp).toTimeString().slice(0, 5); // HH:mm
      return t >= startTime && t <= endTime;
    });
  }, [data, startTime, endTime]);

  const formattedData = useMemo(() => {
    const grouped: { [timestamp: string]: GroupedEntry } = {};
    filteredData.forEach((d) => {
      const ts = new Date(d.timestamp).toLocaleTimeString();
      if (!grouped[ts]) grouped[ts] = { timestamp: ts };
      grouped[ts][d.device_name] =
        selectParam === "temp"
          ? d.temp
          : selectParam === "humid"
          ? d.humidity
          : selectParam === "adjust_co2"
          ? d.adjust_co2
          : d.co2;
    });
    return Object.values(grouped);
  }, [filteredData, selectParam]);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="text-center text-3xl mb-10">{selectParam}</div>
      <div className="flex gap-4 items-center">
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

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={formattedData}>
          <XAxis dataKey="timestamp" />
          <YAxis
            label={{
              value:
                selectParam === "temp"
                  ? "Temp (°C)"
                  : selectParam === "humid"
                  ? "Humidity (%)"
                  : "CO₂ (ppm)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="tongdy_1"
            stroke="#8884d8"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="tongdy_2"
            stroke="#82ca9d"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="tongdy_3"
            stroke="#ffc658"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="tongdy_4"
            stroke="#ff7300"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
