import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function GoalsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("male");
  const [goal, setGoal] = useState("maintain");
  const [targetWeight, setTargetWeight] = useState(""); // เป้าหมาย กก.
  const [activityLevel, setActivityLevel] = useState("sedentary");

  const [bmi, setBmi] = useState<number | null>(null);
  const [bmr, setBmr] = useState<number | null>(null);
  const [plan, setPlan] = useState("");
  const [macro, setMacro] = useState("");
  const [foodSuggestion, setFoodSuggestion] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoggedIn(true);
    fetch("http://localhost:8080/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user info");
        return res.json();
      })
      .then((data) => {
        setUserInfo(data);

        if (data.birthday) {
          const birthDate = new Date(data.birthday);
          const today = new Date();
          let calculatedAge = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          const dayDiff = today.getDate() - birthDate.getDate();

          if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            calculatedAge--;
          }

          setAge(calculatedAge);
        }

        if (data.gender === "male" || data.gender === "female") {
          setGender(data.gender);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUserInfo(null);
        navigate("/login");
      });
  }, [navigate]);

  const handleGoToProfile = () => {
    navigate("/profile");
    setShowDropdown(false);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
    setShowDropdown(false);
    setIsMenuOpen(false);
  };

  const toggleDropdown = useCallback(() => setShowDropdown((prev) => !prev), []);

  const activityFactorMap: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  const calculate = () => {
    if (height <= 0 || weight <= 0 || age <= 0) {
      alert("กรุณากรอกข้อมูลส่วนสูง น้ำหนัก และตรวจสอบอายุ");
      return;
    }

    const bmiCalc = weight / ((height / 100) ** 2);
    const bmrCalc =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const activityFactor = activityFactorMap[activityLevel] || 1.2;
    const tdee = bmrCalc * activityFactor;

    setBmi(bmiCalc);
    setBmr(bmrCalc);

    let targetCalories = tdee;
    let recommendation = "";
    const targetKg = targetWeight ? parseFloat(targetWeight) : null;

    if (goal === "lose") {
      targetCalories = tdee - 500;
      recommendation = `ลดไขมัน${targetKg !== null && !isNaN(targetKg) ? ` ${targetKg} กิโลกรัม` : ""}: กินวันละประมาณ ${Math.round(targetCalories)} แคลอรี่ พร้อมคาร์ดิโอ 3-5 วัน/สัปดาห์`;
    } else if (goal === "gain") {
      targetCalories = tdee + 400;
      recommendation = `เพิ่มกล้าม${targetKg !== null && !isNaN(targetKg) ? ` ${targetKg} กิโลกรัม` : ""}: กินวันละประมาณ ${Math.round(targetCalories)} แคลอรี่ พร้อมเวทเทรนนิ่ง 4-6 วัน/สัปดาห์`;
    } else {
      recommendation = `คงรูปร่าง: กินวันละประมาณ ${Math.round(targetCalories)} แคลอรี่ พร้อมออกกำลังกายเบาๆ`;
    }

    const proteinPerKg = goal === "gain" ? 2.0 : 1.6;
    const protein = Math.round(proteinPerKg * weight);
    const fatCalories = targetCalories * 0.25;
    const fat = Math.round(fatCalories / 9);
    const carbsCalories = targetCalories - (protein * 4 + fat * 9);
    const carbs = Math.round(carbsCalories / 4);

    const macroPlan = `🍗 โปรตีน: ${protein}g | 🍚 คาร์บ: ${carbs}g | 🥑 ไขมัน: ${fat}g`;

    let food = "";
    if (goal === "lose") {
      food = "เมนูแนะนำ: อกไก่ย่าง + สลัดผัก, ไข่ต้ม, น้ำพริกปลาทู";
    } else if (goal === "gain") {
      food = "เมนูแนะนำ: ข้าวกล้อง + ไข่ + อกไก่, มันฝรั่งต้ม, เวย์โปรตีน";
    } else {
      food = "เมนูแนะนำ: ข้าว + ไข่เจียว, ข้าวหมูย่าง, ผัดผักรวม";
    }

    setPlan(recommendation);
    setMacro(macroPlan);
    setFoodSuggestion(food);
  };

  return (
    <div className="min-h-screen bg-[#ff7b00] text-white pb-8">
      <nav className="bg-[#991b1b] shadow-md">
        <div className="mx-auto flex items-center justify-between p-4 sm:p-6 relative">
          <div className="text-2xl font-bold">
            <a className="focus:outline-none" href="/home">
              Eat <span className="text-sm sm:text-xl">แหลก</span>
            </a>
          </div>

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <ul
            className={`flex-col absolute top-full left-0 right-0 bg-[#991b1b] p-4 transition-transform duration-300 ease-in-out
              sm:flex sm:flex-row sm:items-center sm:space-x-4 sm:bg-transparent sm:p-0 sm:static sm:translate-y-0 sm:opacity-100 sm:pointer-events-auto
              ${isMenuOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-20 opacity-0 pointer-events-none"} z-40`}
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
            {isLoggedIn && userInfo ? (
              <li className="relative">
                <button
                  onClick={() => toggleDropdown()}
                  className="block px-3 py-2 text-white focus:outline-none rounded sm:inline-block whitespace-nowrap"
                >
                  สวัสดี, {userInfo.firstname}
                </button>
                {showDropdown && (
                  <div className="absolute left-0 mt-2 w-26 bg-white rounded shadow z-50 text-black">
                    <button
                      onClick={handleGoToProfile}
                      className="block w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none"
                    >
                      ข้อมูลผู้ใช้
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowDropdown(false);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none"
                    >
                      ลงชื่อออก
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <li>
                <a
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-white hover:bg-[#7a1414] rounded sm:inline-block focus:outline-none"
                >
                  ลงชื่อเข้าใช้งาน
                </a>
              </li>
            )}
          </ul>
        </div>
      </nav>

      <main className="w-full max-w-md mx-auto bg-white rounded-xl shadow-xl p-8 text-black my-5">
        <h1 className="text-3xl font-bold text-center mb-4">🎯 วางแผนเป้าหมายการออกกำลังกาย</h1>

        <div>
          <label className="block font-semibold mb-1">ส่วนสูง (ซม.)</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            min={0}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">น้ำหนัก (กก.)</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            min={0}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">อายุ (ปี)</label>
          <input
            type="number"
            className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
            value={age}
            disabled
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">เพศ</label>
          <select
            className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
            value={gender}
            disabled
          >
            <option value="male">ชาย</option>
            <option value="female">หญิง</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">ระดับกิจกรรม</label>
          <select
            className="w-full p-2 border rounded"
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
          >
            <option value="sedentary">นั่งทำงาน ไม่ค่อยออกกำลังกาย</option>
            <option value="light">ออกกำลังกายเบาๆ 1-3 วัน/สัปดาห์</option>
            <option value="moderate">ออกกำลังกายปานกลาง 3-5 วัน/สัปดาห์</option>
            <option value="active">ออกกำลังกายหนัก 6-7 วัน/สัปดาห์</option>
            <option value="veryActive">ออกกำลังกายหนัก + งานหนัก</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">เป้าหมาย</label>
          <select
            className="w-full p-2 border rounded"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            <option value="lose">ลดไขมัน</option>
            <option value="gain">เพิ่มกล้าม</option>
            <option value="maintain">คงรูปร่าง</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">จำนวนที่ต้องการ (กก.)</label>
          <input
            type="number"
            min={0}
            className="w-full p-2 border rounded"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            placeholder="เช่น 36"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full mt-5 bg-[#991b1b] text-white py-2 rounded font-bold hover:bg-[#7c1515]"
        >
          คำนวณ
        </button>

        {bmi !== null && bmr !== null && (
          <div className="mt-6 p-4 bg-yellow-100 border border-[#991b1b] rounded space-y-2">
            <p className="text-xl font-bold text-[#991b1b]">BMI: {bmi.toFixed(2)}</p>
            <p className="text-xl font-bold text-[#991b1b]">BMR: {Math.round(bmr)} แคลอรี่/วัน</p>
            <p className="text-gray-800">{plan}</p>
            <p className="text-gray-800">{macro}</p>
            <p className="text-gray-800">{foodSuggestion}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default GoalsPage;
