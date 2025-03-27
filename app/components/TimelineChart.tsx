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
  temp: number;
  humidity: number;
  co2: number;
  device_name: string;
  timestamp: string;
  adjust_co2: string;
}

type GroupedEntry = {
  timestamp: string;
  [deviceName: string]: number | string;
};

interface Props {
  data: DataPoint[];
  selectParam: "temp" | "humid" | "co2" | "adjust_co2";
  // pages: "HLR" | "IAQ";
}

export default function TempLineChart({ data, selectParam }: Props) {
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");

  const interpolatedData = useMemo(() => {
    const allTimestamps = Array.from(
      new Set(
        data.map((d) =>
          new Date(d.timestamp).toLocaleTimeString("en-GB", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        )
      )
    ).sort();
 
    const deviceData: { [device: string]: { [ts: string]: number } } = {};

    data.forEach((d) => {
      const ts = new Date(d.timestamp).toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const value =
        selectParam === "temp"
          ? d.temp
          : selectParam === "humid"
          ? d.humidity
          : selectParam === "adjust_co2"
          ? parseInt(d.adjust_co2)
          : d.co2;

      if (!deviceData[d.device_name]) {
        deviceData[d.device_name] = {};
      }
      deviceData[d.device_name][ts] = value;
    });

    const result: GroupedEntry[] = allTimestamps.map((ts) => {
      const entry: GroupedEntry = { timestamp: ts };
      ["tongdy_1", "tongdy_2", "tongdy_3", "tongdy_4"].forEach((device) => {
        const perDeviceData = deviceData[device] || {};
        if (perDeviceData[ts] !== undefined) {
          entry[device] = perDeviceData[ts];
        } else {
          const timestamps = Object.keys(perDeviceData).sort();
          const prevTs = timestamps.filter((t) => t < ts).pop();
          const nextTs = timestamps.find((t) => t > ts);

          if (prevTs && nextTs) {
            if (prevTs === nextTs) {
              entry[device] = perDeviceData[prevTs];
            } else {
              const prevValue = perDeviceData[prevTs];
              const nextValue = perDeviceData[nextTs];
              const timeDiff =
                new Date(`1970-01-01T${nextTs}`).getTime() -
                new Date(`1970-01-01T${prevTs}`).getTime();
              const currentDiff =
                new Date(`1970-01-01T${ts}`).getTime() -
                new Date(`1970-01-01T${prevTs}`).getTime();
              if (timeDiff !== 0) {
                entry[device] =
                  prevValue +
                  (nextValue - prevValue) * (currentDiff / timeDiff);
              } else {
                entry[device] = prevValue;
              }
            }
          } else if (prevTs) {
            entry[device] = perDeviceData[prevTs];
          } else if (nextTs) {
            entry[device] = perDeviceData[nextTs];
          }
        }
      });

      return entry;
    });

    return result;
  }, [data, selectParam]);

  const filteredData = useMemo(() => {
    return interpolatedData.filter((entry) => {
      const dateObj = new Date(`1970-01-01T${entry.timestamp}`);
      const hh = String(dateObj.getHours()).padStart(2, "0");
      const mm = String(dateObj.getMinutes()).padStart(2, "0");
      const hhmm = `${hh}:${mm}`;
      return hhmm >= startTime && hhmm <= endTime;
    });
  }, [interpolatedData, startTime, endTime]);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="text-center text-3xl mb-4">{selectParam}</div>
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

      {/* แสดงกราฟ */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis
            label={{
              value:
                selectParam === "temp"
                  ? "Temp (°C)"
                  : selectParam === "humid"
                  ? "Humidity (%)"
                  : selectParam === "adjust_co2"
                  ? "CO₂ (ppm)"
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
