"use client";
import { useRouter } from "next/navigation";
const IAQDashboard = () => {
  const router = useRouter();
  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full flex justify-end mr-10">
        <button
          className="w-[20%] bg-gray-600 rounded-lg h-[40px] hover:bg-gray-700"
          onClick={() => {
            navigateTo("/");
          }}
        >
          HLR IAQ
        </button>
      </div>
    </div>
  );
};

export default IAQDashboard;
