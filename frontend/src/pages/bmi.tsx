import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BMI() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [bmrResult, setBmrResult] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsLoggedIn(false);
      setUserInfo(null);
      return;
    }

    fetch("http://localhost:8080/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user info");
        return res.json();
      })
      .then((data) => {
        setUserInfo(data);
        setIsLoggedIn(true);

        if (data.birthday) {
          const birthDate = new Date(data.birthday);
          const today = new Date();

          let calculatedAge = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          const dayDiff = today.getDate() - birthDate.getDate();

          if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            calculatedAge--;
          }

          setAge(calculatedAge.toString());
        }

        if (data.gender === "male" || data.gender === "female") {
          setGender(data.gender);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUserInfo(null);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setShowDropdown(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

  const handleGoToProfile = () => {
    setShowDropdown(false);
    setIsMenuOpen(false);
    navigate("/profile");
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const interpretBMI = (bmi: number) => {
    if (bmi < 18.5) return "ผอม";
    else if (bmi <= 24.9) return "น้ำหนักปกติ";
    else if (bmi <= 29.9) return "น้ำหนักเกิน";
    else return "อ้วน";
  };

  const calculateBMR = (w: number, h: number, a: number, g: string) => {
    return g === "male"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;
  };

  const calculateBMIAndBMR = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age, 10);

    if (!h || !w || !a || h <= 0 || w <= 0 || a <= 0) {
      setBmiResult(null);
      setBmrResult(null);
      setStatus("");
      setError("⚠️ กรุณากรอกข้อมูลให้ครบและถูกต้อง");
      return;
    }

    const isUnrealistic =
      (a <= 5 && (h > 120 || w > 30)) ||
      (a <= 12 && (h > 170 || w > 60)) ||
      (a >= 13 && h > 220) ||
      h < 50 ||
      w < 5;

    if (isUnrealistic) {
      setBmiResult(null);
      setBmrResult(null);
      setStatus("");
      setError("⚠️ ข้อมูลที่กรอกอาจไม่สมเหตุสมผล โปรดตรวจสอบอีกครั้ง");
      return;
    }

    setError("");
    const bmi = w / ((h / 100) ** 2);
    const bmr = calculateBMR(w, h, a, gender);
    setBmiResult(bmi);
    setBmrResult(bmr);
    setStatus(interpretBMI(bmi));
  };

  return (
    <div className="min-h-screen bg-[#ff7b00] text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#991b1b] shadow-md">
        <div className="mx-auto flex items-center justify-between p-4 sm:p-6 relative">
          <a href="/home" className="text-2xl font-bold focus:outline-none">
            Eat <span className="text-sm sm:text-xl">แหลก</span>
          </a>

          {/* Hamburger for mobile */}
          <button
            onClick={toggleMenu}
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

          {/* Menu */}
          <ul
            className={`
              flex-col
              absolute top-full left-0 right-0
              bg-[#991b1b]
              p-4
              transition-transform duration-300 ease-in-out
              sm:flex sm:flex-row sm:items-center sm:space-x-4 sm:bg-transparent sm:p-0 sm:static sm:translate-y-0 sm:opacity-100 sm:pointer-events-auto
              ${isMenuOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-20 opacity-0 pointer-events-none"}
              z-40
            `}
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
                  onClick={toggleDropdown}
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
                      onClick={handleLogout}
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

      {/* Content */}
      <main className="flex-grow flex flex-col justify-center items-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 text-black">
          <h1 className="text-3xl font-bold text-center text-[#991b1b] py-3 mb-6">
            คำนวณค่า BMI และ BMR
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center shadow">
              {error}
            </div>
          )}

          <form onSubmit={calculateBMIAndBMR} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">ส่วนสูง (เซนติเมตร)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full border border-[#991b1b] rounded-lg p-2"
                placeholder="เช่น 165"
                min="0"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">น้ำหนัก (กิโลกรัม)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full border border-[#991b1b] rounded-lg p-2"
                placeholder="เช่น 55"
                min="0"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">อายุ (ปี)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                readOnly={isLoggedIn}
                className={`w-full border border-[#991b1b] rounded-lg p-2 ${
                  isLoggedIn ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                }`}
                placeholder="เช่น 20"
                min="0"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">เพศ</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={isLoggedIn}
                className={`w-full border border-[#991b1b] rounded-lg p-2 ${
                  isLoggedIn ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                }`}
              >
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full font-bold rounded-lg bg-[#991b1b] text-white py-3 transform transition-transform duration-300 hover:scale-105"
            >
              คำนวณ BMI & BMR
            </button>
          </form>

          {bmiResult !== null && bmrResult !== null && (
            <div className="mt-6 text-center bg-[#fef9ec] border border-[#991b1b] rounded-lg p-4 shadow-sm">
              <p className="text-xl font-bold text-[#991b1b]">BMI: {bmiResult.toFixed(2)}</p>
              <p className="mt-1 text-gray-800 text-lg">ผลลัพธ์: {status}</p>
              <p className="mt-3 text-xl font-bold text-[#991b1b]">
                BMR: {bmrResult.toFixed(0)} แคลอรี่/วัน
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default BMI;
