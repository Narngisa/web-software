import React, { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function BMI() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const interpretBMI = (bmi: number) => {
    if (bmi < 18.5) return "ผอม";
    else if (bmi <= 24.9) return "น้ำหนักปกติ";
    else if (bmi <= 29.9) return "น้ำหนักเกิน";
    else return "อ้วน";
  };

  const calculateBMR = (w: number, h: number, a: number, g: string) => {
    return g === "ชาย"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;
  };

  const calculateBMIAndBMR = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age, 10);

    if (!h || !w || !a || h <= 0 || w <= 0 || a <= 0) {
      Swal.fire({
        icon: "error",
        title: "ข้อมูลไม่ถูกต้อง",
        text: "⚠️ กรุณากรอกข้อมูลให้ครบและถูกต้อง",
      });
      return;
    }

    const isUnrealistic =
      (a <= 5 && (h > 120 || w > 30)) ||
      (a <= 12 && (h > 170 || w > 60)) ||
      (a >= 13 && h > 220) ||
      h < 50 ||
      w < 5;

    if (isUnrealistic) {
      Swal.fire({
        icon: "warning",
        title: "ข้อมูลอาจไม่สมเหตุสมผล",
        text: "⚠️ โปรดตรวจสอบส่วนสูง น้ำหนัก และอายุอีกครั้ง",
      });
      return;
    }

    const bmi = w / (h / 100) ** 2;
    const bmr = calculateBMR(w, h, a, gender);
    const status = interpretBMI(bmi);

    Swal.fire({
      title:
        '<span style="color:#991b1b; font-size:1.5rem; font-weight:bold;">ผลลัพธ์ BMI & BMR</span>',
      html: `
        <p style="margin:0.5rem 0; text-align:left;"><strong>BMI (ค่าดัชนีมวลกาย):</strong> ${bmi.toFixed(
          2
        )} (${status})</p>
        <p style="margin:0.5rem 0; text-align:left;"><strong>BMR (ค่าการเผาผลาญพลังงาน):</strong> ${bmr.toFixed(
          0
        )} แคลอรี่/วัน</p>
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
        confirmButton:
          "text-white font-bold py-2 px-6 rounded-xl mt-4 hover:scale-105 transition-transform duration-200",
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ff7b00] to-[#ff9f43] text-white flex flex-col">
      {/* Navbar */}
      <nav className="backdrop-blur-md bg-[#991b1b]/90 shadow-lg sticky top-0 z-50">
        <div className="mx-auto flex items-center justify-between px-6 py-3">
          {/* โลโก้ */}
          <a
            href="/home"
            className="text-2xl font-extrabold text-white tracking-wide hover:text-yellow-300 transition-colors duration-300"
          >
            Eat <span className="text-sm sm:text-xl font-light">แหลกรู้ไหมกี่ </span>Cal
          </a>

          {/* Hamburger (มือถือเท่านั้น) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden focus:outline-none z-50 p-2 rounded-md hover:bg-white/20 transition-colors"
            aria-label="Toggle menu"
            type="button"
          >
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

          {/* เมนู */}
          <ul
            className={`
        flex-col absolute top-full left-0 right-0 bg-[#991b1b]/95 rounded-b-xl shadow-md px-6 py-4
        transform transition-all duration-300 ease-in-out
        sm:static sm:flex sm:flex-row sm:items-center sm:space-x-8 sm:bg-transparent sm:shadow-none sm:rounded-none sm:p-0
        ${
          isMenuOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-5 opacity-0 pointer-events-none sm:opacity-100 sm:translate-y-0 sm:pointer-events-auto"
        }
        z-40
      `}
          >
            {[
              { href: "/home", label: "หน้าหลัก" },
              { href: "/bmi", label: "BMI" },
              { href: "/goals", label: "ออกกำลังกาย" },
            ].map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="relative block px-3 py-2 text-white font-medium transition-colors duration-200 hover:text-yellow-300 sm:px-2 sm:py-1"
                >
                  {item.label}
                  {/* underline effect */}
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-grow w-full flex justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-gradient-to-br from-white via-orange-50 to-white rounded-3xl shadow-2xl p-10 text-black border border-orange-200">
          <h1 className="text-3xl font-extrabold text-center mb-8 text-[#991b1b] drop-shadow-lg">
            คำนวณค่า BMI & BMR
          </h1>

          <form className="space-y-6" onSubmit={calculateBMIAndBMR}>
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-[#7a1414]">
                ส่วนสูง (ซม.)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="เช่น 165"
                className="w-full p-4 border border-orange-300 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-400 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-[#7a1414]">
                น้ำหนัก (กก.)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="เช่น 55"
                className="w-full p-4 border border-orange-300 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-400 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-[#7a1414]">
                อายุ (ปี)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="เช่น 20"
                className="w-full p-4 border border-orange-300 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-400 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-[#7a1414]">เพศ</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-4 border border-orange-300 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200"
              >
                <option value="">-- เลือกเพศ --</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-[#991b1b] to-[#ff7b00] text-white py-4 rounded-3xl font-extrabold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200"
            >
              คำนวณ BMI & BMR
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default BMI;
