import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function GoalsPage() {
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("male");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmr, setBmr] = useState<number | null>(null);
  const [goal, setGoal] = useState("maintain");
  const [plan, setPlan] = useState("");

  const calculate = () => {
    if (height <= 0 || weight <= 0 || age <= 0) {
      alert("กรุณากรอกข้อมูลให้ครบและถูกต้อง");
      return;
    }
    const bmiCalc = weight / ((height / 100) ** 2);
    const bmrCalc =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
    setBmi(bmiCalc);
    setBmr(bmrCalc);

    let recommendation = "";
    if (goal === "lose") {
      recommendation = `ลดไขมัน: กินวันละประมาณ ${Math.round(bmrCalc - 500)} แคลอรี่ พร้อมคาร์ดิโอ 30 นาที 3-5 วัน/สัปดาห์`;
    } else if (goal === "gain") {
      recommendation = `เพิ่มกล้าม: กินวันละประมาณ ${Math.round(bmrCalc + 300)} แคลอรี่ พร้อมเวทเทรนนิ่ง 4-6 วัน/สัปดาห์`;
    } else {
      recommendation = `คงรูปร่าง: กินวันละประมาณ ${Math.round(bmrCalc)} แคลอรี่ พร้อมออกกำลังกายเบาๆ สม่ำเสมอ`;
    }
    setPlan(recommendation);
  };

  return (
    <div className="min-h-screen bg-[#ff7b00] text-white p-4">
      <h1 className="text-3xl font-bold text-center mb-6">เป้าหมายของคุณ</h1>

      <div className="max-w-xl mx-auto bg-white text-black p-6 rounded-xl shadow space-y-4">
        <div>
          <label className="block font-semibold">ส่วนสูง (ซม.)</label>
          <input type="number" className="w-full p-2 border rounded" value={height} onChange={e => setHeight(+e.target.value)} />
        </div>

        <div>
          <label className="block font-semibold">น้ำหนัก (กก.)</label>
          <input type="number" className="w-full p-2 border rounded" value={weight} onChange={e => setWeight(+e.target.value)} />
        </div>

        <div>
          <label className="block font-semibold">อายุ (ปี)</label>
          <input type="number" className="w-full p-2 border rounded" value={age} onChange={e => setAge(+e.target.value)} />
        </div>

        <div>
          <label className="block font-semibold">เพศ</label>
          <select className="w-full p-2 border rounded" value={gender} onChange={e => setGender(e.target.value)}>
            <option value="male">ชาย</option>
            <option value="female">หญิง</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">เป้าหมาย</label>
          <select className="w-full p-2 border rounded" value={goal} onChange={e => setGoal(e.target.value)}>
            <option value="lose">ลดไขมัน</option>
            <option value="gain">เพิ่มกล้าม</option>
            <option value="maintain">คงรูปร่าง</option>
          </select>
        </div>

        <button onClick={calculate} className="w-full bg-[#991b1b] text-white py-2 rounded font-bold hover:bg-[#7c1515]">คำนวณ</button>

        {bmi !== null && bmr !== null && (
          <div className="mt-4 bg-[#fef9ec] border border-[#991b1b] rounded-lg p-4">
            <p className="text-xl font-bold text-[#991b1b]">BMI: {bmi.toFixed(2)}</p>
            <p className="text-xl font-bold text-[#991b1b]">BMR: {Math.round(bmr)} แคลอรี่/วัน</p>
            <p className="mt-2 text-gray-800 text-base">{plan}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoalsPage;
