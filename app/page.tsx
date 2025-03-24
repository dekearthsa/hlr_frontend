"use client";

import { useEffect, useState } from "react";
import TempLineChart from "./components/TimelineChart";
import axios from "axios";
const Home = () => {
  const [hlrData, setHlrData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); 

  const fetchFunc = async () => {
    try {
      const dataNow = await axios.get(
        "https://bkkcodedevearthregisterdemobkk.work/api/selected/2025/03/20"
      );
      setHlrData(dataNow.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchFunc();
  }, []);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-xl font-bold mb-4">Temperature Chart</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <TempLineChart data={hlrData} selectParam="co2" />
      )}
      <br />
      {loading ? <p></p> : <TempLineChart data={hlrData} selectParam="humid" />}
      <br />
      {loading ? <p></p> : <TempLineChart data={hlrData} selectParam="temp" />}
    </div>
  );
};

export default Home;
// ปรับแก้ไข ประวัติตัวละคร Shinei Nouzen (Shin)

// เขาเป็นขุนนางระดับล่างแต่อยู่ใน Hive world ณ ดาวดวงหนึ่ง เขาเป็นอัศวินที่มากฝีมือจากการออกทำสงครามหลาย ๆ ครั้งกับ Xenos รวมไปถึงผู้ทรยศ เคียงคู่กับ Kiriya Nouzen (Kiriya) ตั้งแต่อายุไม่ถึง 15 ปี  Kiriya หนึ่งในอัศวินส่วนตัวของลูกสาว High lord ผู้ว่าการดวงดาวและสนิทกันมาก และ Shin กับ Kiriya ถึงจะเป็นพี่น้องกันห่าง แต่พวกเขาก็เป็นคู่แข่งกันในด้านความสามารถ แต่ก็สนิทกันในเวลาเดียวกัน

// เหตุการณ์เหมือนจะเป็นไปด้วยดี แต่การปฏิวัติจากภายในโดย Chaos ก็เกิดขึ้นเกิดการปะทะกันอย่างหนักน่วงกับผู้ทรยศ และเหล่า Geater deamon ก็โผล่มา Kiriya Nouzen  สู้จนตัวตายเพื่อปกป้อง ลูกสาว High lord  แน่นอนว่า Shin ติดอยู่ในอีกหลายแนวรบทำให้ไม่สามารถไปช่วยได้ทัน Kiriya Nouzen ก่อนตายโกรธทุกคน เขาคิดว่า IOM ทำการปฏิวัติจากภายใน และเขาสาบารว่าจะทำลายทำทุก
