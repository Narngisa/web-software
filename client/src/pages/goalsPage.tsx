import { useState } from "react";
import Swal from "sweetalert2"; // npm install sweetalert2

function GoalsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("maintain");
  const [targetWeight, setTargetWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("sedentary");

  const activityFactorMap: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  const calculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age, 10);

    if (!h || !w || !a) {
      Swal.fire({
        icon: "warning",
        title: "กรอกข้อมูลไม่ครบ",
        text: "กรุณากรอกส่วนสูง น้ำหนัก และอายุให้ถูกต้อง",
      });
      return;
    }

    const bmiCalc = w / (h / 100) ** 2;
    const bmrCalc =
      gender === "ชาย"
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;

    const activityFactor = activityFactorMap[activityLevel] || 1.2;
    const tdee = bmrCalc * activityFactor;

    let targetCalories = tdee;
    let recommendation = "";
    const targetKg = targetWeight ? parseFloat(targetWeight) : null;

    if (goal === "lose") {
      targetCalories = tdee - 500;
      recommendation = `ลดไขมัน${
        targetKg !== null && !isNaN(targetKg) ? ` ${targetKg} กก.` : ""
      } กินวันละประมาณ ${Math.round(
        targetCalories
      )} แคลอรี่ พร้อมคาร์ดิโอ 3-5 วัน/สัปดาห์`;
    } else if (goal === "gain") {
      targetCalories = tdee + 400;
      recommendation = `เพิ่มกล้าม${
        targetKg !== null && !isNaN(targetKg) ? ` ${targetKg} กก.` : ""
      } กินวันละประมาณ ${Math.round(
        targetCalories
      )} แคลอรี่ พร้อมเวทเทรนนิ่ง 4-6 วัน/สัปดาห์`;
    } else {
      recommendation = `คงรูปร่าง: กินวันละประมาณ ${Math.round(
        targetCalories
      )} แคลอรี่ พร้อมออกกำลังกายเบาๆ`;
    }

    const proteinPerKg = goal === "gain" ? 2.0 : 1.6;
    const protein = Math.round(proteinPerKg * w);
    const fatCalories = targetCalories * 0.25;
    const fat = Math.round(fatCalories / 9);
    const carbsCalories = targetCalories - (protein * 4 + fat * 9);
    const carbs = Math.round(carbsCalories / 4);
    const macroPlan = `🍗 โปรตีน: ${protein}g | 🍚 คาร์บ: ${carbs}g | 🥑 ไขมัน: ${fat}g`;

    // เมนูอาหารหลากหลาย
    const foodOptions: Record<string, string[]> = {
      lose: [
        "อกไก่ย่าง + สลัดผัก, ไข่ต้ม, น้ำพริกปลาทู",
        "ปลาอบ + ผักต้ม, ข้าวกล้อง, สลัดผัก",
        "โยเกิร์ตไขมันต่ำ + ผลไม้, อกไก่ย่าง, ข้าวโอ๊ต",
      ],
      gain: [
        "ข้าวกล้อง + ไข่ + อกไก่, มันฝรั่งต้ม, เวย์โปรตีน",
        "ข้าวโพด + ไข่เจียว, อกไก่ทอด, นมจืด",
        "สเต็กเนื้อ + มันบด, ข้าวกล้อง, ผักอบ",
      ],
      maintain: [
        "ข้าว + ไข่เจียว, ข้าวหมูย่าง, ผัดผักรวม",
        "ข้าวกล้อง + ไก่ย่าง, ต้มจืด, สลัดผัก",
        "สลัดผัก + ปลาอบ, ข้าวโพด, ผลไม้ตามฤดูกาล",
      ],
    };
    const foodList = foodOptions[goal];
    const food = foodList[Math.floor(Math.random() * foodList.length)];

    // SweetAlert2 แสดงผล
    Swal.fire({
      title:
        '<span style="color:#991b1b; font-size:1.5rem; font-weight:bold;">ผลลัพธ์การคำนวณ</span>',
      html: `
        <p style="margin:0.5rem 0; text-align:left;"><strong>BMI (ค่าดัชนีมวลกาย):</strong> ${bmiCalc.toFixed(
          2
        )}</p>
        <p style="margin:0.5rem 0; text-align:left;"><strong>BMR (ค่าการเผาผลาญพลังงาน):</strong> ${Math.round(
          bmrCalc
        )} แคลอรี่/วัน</p>
        <p style="margin:0.5rem 0; text-align:left;"><strong>เป้าหมาย:</strong> ${recommendation}</p>
        <p style="margin:0.5rem 0; text-align:left;"><strong>จำนวนการกิน:</strong></p>
        <p style="margin:0.5rem 0; text-align:left;">${macroPlan}</p>
        <p style="margin:0.5rem 0; text-align:left;"><strong>เมนูแนะนำ:</strong> ${food}</p>
      `,
      icon: "success",
      width: 600,
      padding: "2rem",
      background: "linear-gradient(to bottom, #fff7f0, #ffe5d4)",
      confirmButtonText: "ปิด",
      confirmButtonColor: "#ff7b00",
      customClass: {
        popup: "rounded-3xl shadow-2xl border border-orange-300",
        title: "font-extrabold text-xl",
        confirmButton: "text-white font-bold py-2 px-6 rounded-xl mt-4",
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ff7b00] to-[#ff9f43] text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#991b1b] shadow-md">
        <div className="mx-auto flex items-center justify-between p-4 sm:p-6 relative">
          <a href="/home" className="text-2xl font-bold focus:outline-none">
            Eat <span className="text-sm sm:text-xl">แหลก</span>
          </a>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden focus:outline-none z-50"
            aria-label="Toggle menu"
            type="button"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <ul
            className={`flex-col absolute top-full left-0 right-0 bg-[#991b1b] p-4 transition-transform duration-300 ease-in-out
            sm:flex sm:flex-row sm:items-center sm:space-x-4 sm:bg-transparent sm:p-0 sm:static sm:translate-y-0 sm:opacity-100 sm:pointer-events-auto
            ${
              isMenuOpen
                ? "translate-y-0 opacity-100 pointer-events-auto"
                : "-translate-y-20 opacity-0 pointer-events-none"
            } z-40`}
          >
            <li>
              <a
                href="/home"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-white hover:bg-[#7a1414] rounded sm:inline-block focus:outline-none"
              >
                หน้าหลัก
              </a>
            </li>
            <li>
              <a
                href="/bmi"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-white hover:bg-[#7a1414] rounded sm:inline-block focus:outline-none"
              >
                BMI
              </a>
            </li>
            <li>
              <a
                href="/goals"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-white hover:bg-[#7a1414] rounded sm:inline-block focus:outline-none"
              >
                ออกกำลังกาย
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-grow w-full max-w-md mx-auto bg-gradient-to-br from-white via-orange-50 to-white rounded-3xl shadow-2xl p-10 text-black my-12 border border-orange-200">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-[#991b1b] drop-shadow-lg">
          🎯 วางแผนเป้าหมายการออกกำลังกาย
        </h1>

        <div className="space-y-6">
          {/* ส่วนสูง */}
          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-[#7a1414]">
              ส่วนสูง (ซม.)
            </label>
            <input
              type="number"
              className="w-full p-4 border border-orange-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-md transition-all duration-200 placeholder:text-gray-400"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min={0}
              placeholder="เช่น 170"
            />
          </div>

          {/* น้ำหนัก */}
          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-[#7a1414]">
              น้ำหนัก (กก.)
            </label>
            <input
              type="number"
              className="w-full p-4 border border-orange-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-md transition-all duration-200 placeholder:text-gray-400"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min={0}
              placeholder="เช่น 65"
            />
          </div>

          {/* อายุ */}
          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-[#7a1414]">
              อายุ (ปี)
            </label>
            <input
              type="number"
              className="w-full p-4 border border-orange-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-md transition-all duration-200 placeholder:text-gray-400"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min={0}
              placeholder="เช่น 25"
            />
          </div>

          {/* เพศ */}
          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-[#7a1414]">เพศ</label>
            <select
              className="w-full p-4 border border-orange-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-md transition-all duration-200"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">-- เลือกเพศ --</option>
              <option value="ชาย">ชาย</option>
              <option value="หญิง">หญิง</option>
            </select>
          </div>

          {/* ระดับกิจกรรม */}
          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-[#7a1414]">
              ระดับกิจกรรม
            </label>
            <select
              className="w-full p-4 border border-orange-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-md transition-all duration-200"
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
            >
              <option value="sedentary">นั่งทำงาน ไม่ค่อยออกกำลังกาย</option>
              <option value="light">ออกกำลังกายเบาๆ 1-3 วัน/สัปดาห์</option>
              <option value="moderate">
                ออกกำลังกายปานกลาง 3-5 วัน/สัปดาห์
              </option>
              <option value="active">ออกกำลังกายหนัก 6-7 วัน/สัปดาห์</option>
              <option value="veryActive">ออกกำลังกายหนัก + งานหนัก</option>
            </select>
          </div>

          {/* เป้าหมาย */}
          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-[#7a1414]">
              เป้าหมาย
            </label>
            <select
              className="w-full p-4 border border-orange-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-md transition-all duration-200"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            >
              <option value="lose">ลดไขมัน</option>
              <option value="gain">เพิ่มกล้าม</option>
              <option value="maintain">คงรูปร่าง</option>
            </select>
          </div>

          {/* น้ำหนักเป้าหมาย */}
          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-[#7a1414]">
              จำนวนที่ต้องการ (กก.)
            </label>
            <input
              type="number"
              min={0}
              className="w-full p-4 border border-orange-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-md transition-all duration-200 placeholder:text-gray-400"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              placeholder="เช่น 60"
            />
          </div>

          {/* ปุ่มคำนวณ */}
          <button
            onClick={calculate}
            className="w-full mt-6 bg-gradient-to-r from-[#991b1b] to-[#ff7b00] text-white py-4 rounded-3xl font-extrabold text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200"
          >
            คำนวณ
          </button>
        </div>
      </main>
    </div>
  );
}

export default GoalsPage;
