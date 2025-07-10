import React, { useState } from 'react';

function BMI() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('');

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!h || !w || h <= 0 || w <= 0) {
      setBmiResult(null);
      setStatus('กรุณากรอกข้อมูลให้ถูกต้อง');
      return;
    }

    const heightInMeter = h / 100;
    const bmi = w / (heightInMeter * heightInMeter);
    setBmiResult(bmi);

    if (bmi < 18.5) setStatus('ผอมเกินไป');
    else if (bmi < 23) setStatus('น้ำหนักปกติ');
    else if (bmi < 25) setStatus('น้ำหนักเกิน');
    else if (bmi < 30) setStatus('อ้วน');
    else setStatus('อ้วนมาก');
  };

  return (
    <div className="text-center mt-10">
      <h1 className="font-bold text-2xl">BMI Calculator</h1>
      <form onSubmit={calculateBMI} className="flex flex-col gap-3 w-[25rem] mx-auto mt-5">
        <label className="font-semibold">ส่วนสูง (เซนติเมตร)</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="bg-white border-2 border-[#d69b2e] rounded-lg p-2 focus:outline-none"
          placeholder="ใส่ส่วนสูงเป็นเซนติเมตร"
        />

        <label className="font-semibold">น้ำหนัก (กิโลกรัม)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="bg-white border-2 border-[#d69b2e] rounded-lg p-2 focus:outline-none"
          placeholder="ใส่น้ำหนักเป็นกิโลกรัม"
        />

        <button
          type="submit"
          className="font-bold rounded-lg bg-[#d69b2e] text-white w-[6rem] p-3 mx-auto transform transition-transform duration-300 hover:scale-105"
        >
          คำนวณ
        </button>
      </form>

      {bmiResult !== null && (
        <div className="mt-6 bg-white text-black rounded-lg p-4 shadow-md inline-block">
          <p className="text-xl font-bold">BMI: {bmiResult.toFixed(2)}</p>
          <p className="mt-1 text-lg">{status}</p>
        </div>
      )}
    </div>
  );
}

export default BMI;
