"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TempLineChart from "./components/TimelineChart";
import axios from "axios";

interface DataPoint {
  id: number;
  temp: number;
  humidity: number;
  co2: number;
  device_name: string;
  timestamp: string;
  adjust_co2: string;
}

const Home = () => {
  const router = useRouter();
  const [hlrData, setHlrData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isYear, setYear] = useState("");
  const [isMonth, setMonth] = useState("");
  const [isDate, setDate] = useState("");

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const fetchFunc = async () => {
    try {
      const d = new Date();
      const day = d.getDate();
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      console.log(day + " " + month + " " + year);
      const dataNow = await axios.get(
        `https://bkkcodedevearthregisterdemobkk.work/api/selected/${year}/${month}/${day}`
      );
      setHlrData(dataNow.data);
      setYear(String(year));
      setMonth(String(month));
      setDate(String(day));
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlerFetchData = async () => {
    setLoading(true);
    const dataNow = await axios.get(
      `https://bkkcodedevearthregisterdemobkk.work/api/selected/${isYear}/${isMonth}/${isDate}`
    );
    setHlrData(dataNow.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFunc();
  }, []);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full flex justify-end mr-10">
        <button
          className="w-[20%] bg-gray-600 rounded-lg h-[40px] hover:bg-gray-700"
          onClick={() => {
            navigateTo("/view/iaq");
          }}
        >
          Dashboard IAQ
        </button>
      </div>
      <h1 className="text-xl font-bold mb-4">Dashboard HLR</h1>
      {loading ? (
        <div className="z-[-1] w-full opacity-50">
          <div className="flex justify-around w-[80%]  m-auto">
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
              className="bg-gray-600 w-[10%] h-[40px] rounded-2xl hover:bg-gray-700  mt-10"
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
              className="bg-gray-600 w-[10%] h-[40px] rounded-2xl hover:bg-gray-700 mt-10"
              onClick={handlerFetchData}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      <br />
      {loading ? (
        <p>Loading....</p>
      ) : (
        <TempLineChart data={hlrData} selectParam="adjust_co2" />
      )}
      <br />
      {loading ? <p></p> : <TempLineChart data={hlrData} selectParam="co2" />}
      <br />
      {loading ? <p></p> : <TempLineChart data={hlrData} selectParam="humid" />}
      <br />
      {loading ? <p></p> : <TempLineChart data={hlrData} selectParam="temp" />}
    </div>
  );
};

export default Home;
