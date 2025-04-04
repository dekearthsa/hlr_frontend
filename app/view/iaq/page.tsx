"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import TimeLineChartIAQ from "../../components/TimeLineChartIAQ";
import axios from "axios";

interface DataItem {
  id: number;
  strDatetime: string;
  VOC: number;
  CO2: number;
  eVOC: number;
  Humid: number;
  Temp: number;
  "PM2.5": number;
  PM10: number;
  CO: number;
}

interface DataPoint {
  id: number;
  strDatetime: string;
  timestamp: string;
  VOC: number;
  CO2: number;
  eVOC: number;
  Humid: number;
  Temp: number;
  "PM2.5": number;
  PM10: number;
  CO: number;
}

const static_api = "https://3a7d-1-46-81-64.ngrok-free.app/api/selected";
const IAQDashboard = () => {
  const router = useRouter();
  const navigateTo = (path: string) => {
    router.push(path);
  };

  const [isData, setData] = useState<DataPoint[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isYear, setYear] = useState("");
  const [isMonth, setMonth] = useState("");
  const [isDate, setDate] = useState("");

  const getUniqueBy = <T extends keyof DataItem>(
    array: DataItem[],
    key: T
  ): DataPoint[] => {
    const seen = new Set<unknown>();
    const result: DataPoint[] = [];

    for (const item of array) {
      const value = item[key];
      if (!seen.has(value)) {
        const dt = DateTime.fromFormat(String(value), "dd/MM/yy HH:mm", {
          zone: "Asia/Bangkok",
        });
        const isoUtc = dt.toUTC().toISO();
        seen.add(value);
        const cleanTimestamp = {
          id: item.id,
          strDatetime: item.strDatetime,
          VOC: item.VOC,
          CO2: item.CO2,
          eVOC: item.eVOC,
          Humid: item.Humid,
          Temp: item.Temp,
          "PM2.5": item["PM2.5"],
          PM10: item.PM10,
          CO: item.CO,
          timestamp: String(isoUtc),
        };
        result.push(cleanTimestamp);
      }
    }
    return result;
  };

  useEffect(() => {}, [isData]);

  useEffect(() => {
    const fetchDataFirstTime = async () => {
      setLoading(true);
      await fetchIAQData();
      setLoading(false);
    };
    fetchDataFirstTime();

    const intervalId = setInterval(() => {
      // console.log("Update by interval...");
      autosUpdate();
    }, 180000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchIAQData = async () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const header = { "ngrok-skip-browser-warning": "skip" };

    const { data } = await axios.get(`${static_api}/${year}/${month}/${day}`, {
      headers: header,
    });
    const uniqueData: DataPoint[] = getUniqueBy(data, "strDatetime");
    setData(uniqueData);
  };

  const autosUpdate = async () => {
    const header = { "ngrok-skip-browser-warning": "skip" };
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    try {
      const { data } = await axios.get(
        `${static_api}/${year}/${month}/${day}`,
        { headers: header }
      );
      const uniqueData: DataPoint[] = getUniqueBy(data, "strDatetime");
      setData(uniqueData);
    } catch (err) {
      console.error(err);
    }
  };

  const handlerFetchData = async () => {
    if (!isYear || !isMonth || !isDate) {
      alert("กรุณากรอก Year / Month / Date ให้ครบก่อน");
      return;
    }
    setLoading(true);
    const header = { "ngrok-skip-browser-warning": "skip" };

    try {
      const { data } = await axios.get(
        `${static_api}/${isYear}/${isMonth}/${isDate}`,
        {
          headers: header,
        }
      );
      const uniqueData: DataPoint[] = getUniqueBy(data, "strDatetime");
      setData(uniqueData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">
      <div className="w-full flex justify-end ">
        <button
          className="w-[20%] bg-gray-600 rounded-lg h-[40px] hover:bg-gray-700 mr-10"
          onClick={() => {
            navigateTo("/");
          }}
        >
          HLR IAQ
        </button>
      </div>
      <h1 className="text-xl font-bold  text-center mt-10 mb-10">
        Dashboard IAQ
      </h1>
      {isLoading ? (
        <div className="z-[-1] w-full opacity-50 text-white">
          <div className="flex justify-around w-[80%]  m-auto">
            <div>
              <label className="mr-3">Year</label>
              <input
                className="bg-gray-800 rounded-lg h-[40px]  text-white"
                type="number"
                value={isYear}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div>
              <label className="mr-3">Month</label>
              <input
                className="bg-gray-800 rounded-lg h-[40px]  text-white"
                type="number"
                value={isMonth}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
            <div>
              <label className="mr-3">date</label>
              <input
                className="bg-gray-800 rounded-lg h-[40px]  text-white"
                type="number"
                value={isDate}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full m-auto flex justify-center">
            <button
              className="bg-gray-600 w-[10%] h-[40px] rounded-2xl hover:bg-gray-700  mt-10  text-white"
              onClick={handlerFetchData}
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div className="w-[100%]">
          <div className="flex justify-around w-[80%] m-auto">
            <div>
              <label className="mr-3">Year</label>
              <input
                className="bg-gray-800 rounded-lg h-[40px]"
                type="number"
                value={isYear}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div>
              <label className="mr-3">Month</label>
              <input
                className="bg-gray-800 rounded-lg h-[40px]"
                type="number"
                value={isMonth}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
            <div>
              <label className="mr-3">date</label>
              <input
                className="bg-gray-800 rounded-lg h-[40px]"
                type="number"
                value={isDate}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full m-auto flex justify-center">
            <button
              className="bg-gray-600 w-[10%] h-[40px] rounded-2xl hover:bg-gray-700 mt-[80px]"
              onClick={handlerFetchData}
            >
              Submit
            </button>
          </div>
        </div>
      )}
      <div className="text-center w-[100%] mt-10">
        {isData.length === 0 ? (
          <div className="text-center flex justify-center font-bold">
            <div>Loading...</div>
          </div>
        ) : (
          <TimeLineChartIAQ data={isData} selectParam="VOC" />
        )}
        {isData.length === 0 ? (
          <p></p>
        ) : (
          <TimeLineChartIAQ data={isData} selectParam="CO2" />
        )}
        {isData.length === 0 ? (
          <p></p>
        ) : (
          <TimeLineChartIAQ data={isData} selectParam="eVOC" />
        )}
        {isData.length === 0 ? (
          <p></p>
        ) : (
          <TimeLineChartIAQ data={isData} selectParam="Humid" />
        )}
        {isData.length === 0 ? (
          <p></p>
        ) : (
          <TimeLineChartIAQ data={isData} selectParam="Temp" />
        )}
        {isData.length === 0 ? (
          <p></p>
        ) : (
          <TimeLineChartIAQ data={isData} selectParam="PM2.5" />
        )}
        {isData.length === 0 ? (
          <p></p>
        ) : (
          <TimeLineChartIAQ data={isData} selectParam="PM10" />
        )}
        {isData.length === 0 ? (
          <p></p>
        ) : (
          <TimeLineChartIAQ data={isData} selectParam="CO" />
        )}
      </div>
    </div>
  );
};

export default IAQDashboard;
