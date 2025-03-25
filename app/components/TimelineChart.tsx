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

// รูปแบบข้อมูลของ Object หลัง grouped
type GroupedEntry = {
  timestamp: string;
  [deviceName: string]: number | string; // เช่น { timestamp: "07:00:00", tongdy_1: 500 }
};

interface Props {
  data: DataPoint[];
  selectParam: "temp" | "humid" | "co2" | "adjust_co2";
}

export default function TempLineChart({ data, selectParam }: Props) {
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const interpolatedData = useMemo(() => {
    const allTimestamps = Array.from(
      new Set(data.map((d) => new Date(d.timestamp).toLocaleTimeString()))
    ).sort();
    const deviceData: { [device: string]: { [ts: string]: number } } = {};
    data.forEach((d) => {
      const ts = new Date(d.timestamp).toLocaleTimeString();
      const value =
        selectParam === "temp"
          ? d.temp
          : selectParam === "humid"
          ? d.humidity
          : selectParam === "adjust_co2"
          ? parseInt(d.adjust_co2)
          : d.co2;
      if (selectParam === "adjust_co2") {
        console.log(value);
      }
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
          // ถ้ามีค่าตรง ๆ
          entry[device] = perDeviceData[ts];
        } else {
          // หาค่าก่อนหน้า-ถัดไป เพื่อ Interpolate
          const timestamps = Object.keys(perDeviceData).sort();
          const prevTs = timestamps.filter((t) => t < ts).pop();
          const nextTs = timestamps.find((t) => t > ts);

          if (prevTs && nextTs) {
            // กรณีมีทั้งก่อนหน้าและถัดไป → Interpolate
            if (prevTs === nextTs) {
              entry[device] = perDeviceData[prevTs];
            } else {
              const prevValue = perDeviceData[prevTs];
              const nextValue = perDeviceData[nextTs];
              const timeDiff =
                new Date(`1970-01-01 ${nextTs}`).getTime() -
                new Date(`1970-01-01 ${prevTs}`).getTime();
              const currentDiff =
                new Date(`1970-01-01 ${ts}`).getTime() -
                new Date(`1970-01-01 ${prevTs}`).getTime();
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

  // 2) กรองข้อมูลตามช่วงเวลา startTime - endTime
  const filteredData = useMemo(() => {
    // สมมติ interpolatedData[].timestamp = "7:05:03 AM"
    // เราจะแปลงเป็น HH:mm แบบ 24 ชม. ก่อนเทียบ
    // เพื่อให้เทียบกับ "07:00" - "08:59" ได้ง่าย
    return interpolatedData.filter((entry) => {
      const dateObj = new Date(`1970-01-01 ${entry.timestamp}`);
      const hh = String(dateObj.getHours()).padStart(2, "0");
      const mm = String(dateObj.getMinutes()).padStart(2, "0");
      const hhmm = `${hh}:${mm}`;
      return hhmm >= startTime && hhmm <= endTime;
    });
  }, [interpolatedData, startTime, endTime]);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* หัวข้อ */}
      <div className="text-center text-3xl mb-4">{selectParam}</div>

      {/* ช่องเลือก Start-End Time */}
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

      {/* ส่วนกราฟ */}
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
