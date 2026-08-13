import React, { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function BMI() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("ชาย");
  const [resultData, setResultData] = useState<{
    bmi: number;
    bmr: number;
    status: string;
    statusColor: string;
    advice: string;
  } | null>(null);

  const interpretBMI = (bmi: number) => {
    if (bmi < 18.5) return { status: "น้ำหนักน้อย / ผอม", color: "text-amber-500", advice: "ควรเพิ่มปริมาณสารอาหารที่มีประโยชน์ เน้นโปรตีนและคาร์โบไฮเดรตเชิงซ้อน" };
    else if (bmi <= 22.9) return { status: "สมส่วน / ปกติ", color: "text-emerald-600", advice: "รักษาน้ำหนักและพฤติกรรมการกินที่ดีนี้ไว้ ออกกำลังกายสม่ำเสมอ" };
    else if (bmi <= 24.9) return { status: "ท้วม / น้ำหนักเกิน", color: "text-orange-500", advice: "ควบคุมแป้ง น้ำตาล และของทอด เพิ่มการขยับร่างกายและคาร์ดิโอ" };
    else if (bmi <= 29.9) return { status: "อ้วนระดับ 1", color: "text-red-500", advice: "ควรวางแผนปรับการกินและออกกำลังกายอย่างจริงจังเพื่อลดความเสี่ยงสุขภาพ" };
    else return { status: "อ้วนระดับ 2 (อันตราย)", color: "text-rose-700", advice: "ควรปรึกษาผู้เชี่ยวชาญด้านสุขภาพและปรับเปลี่ยนพฤติกรรมอย่างเคร่งครัด" };
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
        text: "กรุณากรอกส่วนสูง น้ำหนัก และอายุให้ครบถ้วน",
        confirmButtonColor: "#ea580c",
      });
      return;
    }

    const isUnrealistic =
      (a <= 5 && (h > 120 || w > 30)) ||
      (a <= 12 && (h > 170 || w > 60)) ||
      (a >= 13 && h > 230) ||
      h < 50 ||
      w < 10;

    if (isUnrealistic) {
      Swal.fire({
        icon: "warning",
        title: "ข้อมูลอาจไม่สมเหตุสมผล",
        text: "โปรดตรวจสอบส่วนสูง น้ำหนัก และอายุอีกครั้ง",
        confirmButtonColor: "#ea580c",
      });
      return;
    }

    const bmi = w / (h / 100) ** 2;
    const bmr = calculateBMR(w, h, a, gender);
    const { status, color, advice } = interpretBMI(bmi);

    setResultData({
      bmi,
      bmr,
      status,
      statusColor: color,
      advice,
    });

    Swal.fire({
      title:
        '<span style="color:#991b1b; font-size:1.6rem; font-weight:800;">🔥 สรุปผลลัพธ์สุขภาพ</span>',
      html: `
        <div style="text-align:left; font-size: 1rem; color: #374151; line-height: 1.8;">
          <div style="background: #fff7ed; padding: 12px 16px; border-radius: 12px; border: 1px solid #fdba74; margin-bottom: 12px;">
            <p style="margin:0;"><strong>BMI (ดัชนีมวลกาย):</strong> <span style="font-size:1.3rem; font-weight:bold; color:#dc2626;">${bmi.toFixed(2)}</span></p>
            <p style="margin:4px 0 0 0; color:#ea580c; font-weight:600;">สถานะ: ${status}</p>
          </div>
          <div style="background: #fef2f2; padding: 12px 16px; border-radius: 12px; border: 1px solid #fca5a5;">
            <p style="margin:0;"><strong>BMR (พลังงานเผาผลาญพื้นฐาน):</strong> <span style="font-size:1.3rem; font-weight:bold; color:#b91c1c;">${bmr.toFixed(0)}</span> แคลอรี่/วัน</p>
          </div>
          <p style="margin:12px 0 0 0; font-size:0.9rem; color:#6b7280;">💡 ${advice}</p>
        </div>
      `,
      icon: "success",
      width: 520,
      padding: "2rem",
      background: "#ffffff",
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#ea580c",
      customClass: {
        popup: "rounded-3xl shadow-2xl border-2 border-orange-300",
        confirmButton:
          "text-white font-bold py-2.5 px-8 rounded-xl shadow-lg hover:scale-105 transition-all duration-200",
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0808] via-[#2a0e07] to-[#120505] text-white flex flex-col selection:bg-orange-500 selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-8 pb-4 px-4 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-60 bg-gradient-to-tr from-orange-600/25 via-red-600/20 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-300 text-xs sm:text-sm font-semibold mb-3">
            <span>⚖️</span> Body Mass Index & BMR Calculator
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            คำนวณค่า <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-red-500 bg-clip-text text-transparent">BMI & BMR</span>
          </h1>
          <p className="mt-2 text-sm text-orange-200/80">
            วิเคราะห์ดัชนีมวลกายและอัตราการเผาผลาญพลังงานพื้นฐานประจำวันเพื่อวางแผนการกินที่เหมาะสม
          </p>
        </div>
      </section>

      {/* Main Content Form */}
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Card */}
          <div className="lg:col-span-7 bg-gradient-to-br from-white via-orange-50 to-amber-50 rounded-3xl shadow-2xl p-6 sm:p-8 text-neutral-900 border border-orange-200">
            <div className="flex items-center gap-3 border-b border-orange-200/80 pb-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center text-white text-xl shadow-md">
                📝
              </div>
              <div>
                <h2 className="text-xl font-black text-red-950">
                  กรอกข้อมูลสัดส่วนของคุณ
                </h2>
                <p className="text-xs text-neutral-500">
                  ระบบจะคำนวณ BMI และอัตราเผาผลาญ BMR ให้อัตโนมัติ
                </p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={calculateBMIAndBMR}>
              {/* Gender selector */}
              <div>
                <label className="block text-sm font-bold text-neutral-800 mb-2">
                  เพศสภาพ
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["ชาย", "หญิง"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all duration-200 border ${
                        gender === g
                          ? "bg-gradient-to-r from-orange-500 to-red-600 text-white border-transparent shadow-lg shadow-orange-500/30 scale-[1.02]"
                          : "bg-white text-neutral-700 border-orange-200 hover:bg-orange-50"
                      }`}
                    >
                      <span>{g === "ชาย" ? "👨 ชาย" : "👩 หญิง"}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Height & Weight Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-800 mb-1.5">
                    ส่วนสูง (ซม.) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="เช่น 170"
                      className="w-full pl-4 pr-12 py-3.5 bg-white border border-orange-200 rounded-2xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm font-medium"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-orange-400">
                      cm
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-800 mb-1.5">
                    น้ำหนัก (กก.) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="เช่น 65"
                      className="w-full pl-4 pr-12 py-3.5 bg-white border border-orange-200 rounded-2xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm font-medium"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-orange-400">
                      kg
                    </span>
                  </div>
                </div>
              </div>

              {/* Age Input */}
              <div>
                <label className="block text-sm font-bold text-neutral-800 mb-1.5">
                  อายุ (ปี) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="เช่น 24"
                    className="w-full pl-4 pr-12 py-3.5 bg-white border border-orange-200 rounded-2xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm font-medium"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-orange-400">
                    yrs
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-orange-500 via-amber-500 to-red-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-orange-600/30 hover:shadow-orange-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                🔥 คำนวณค่าดัชนีมวลกายทันที
              </button>
            </form>
          </div>

          {/* Quick Result & Reference Table Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Result View if calculated */}
            {resultData ? (
              <div className="bg-gradient-to-br from-orange-950/80 to-red-950/80 rounded-3xl p-6 border-2 border-orange-500/40 shadow-2xl backdrop-blur-xl animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🏆</span>
                  <h3 className="font-extrabold text-lg text-orange-300">
                    ผลการคำนวณล่าสุด
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-orange-500/20 text-center">
                    <span className="text-xs text-orange-300/80 font-medium">ค่า BMI</span>
                    <p className="text-2xl font-black text-white mt-1">
                      {resultData.bmi.toFixed(1)}
                    </p>
                    <span className="text-[11px] font-bold text-orange-400">
                      {resultData.status}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-orange-500/20 text-center">
                    <span className="text-xs text-orange-300/80 font-medium">ค่า BMR</span>
                    <p className="text-2xl font-black text-amber-400 mt-1">
                      {resultData.bmr.toFixed(0)}
                    </p>
                    <span className="text-[11px] text-orange-200/70">
                      แคลอรี่/วัน
                    </span>
                  </div>
                </div>

                <p className="text-xs text-orange-100/90 leading-relaxed bg-orange-900/40 p-3.5 rounded-xl border border-orange-500/20">
                  💡 {resultData.advice}
                </p>
              </div>
            ) : null}

            {/* Standard BMI Reference Legend */}
            <div className="bg-neutral-900/80 rounded-3xl p-6 border border-orange-500/20 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">📊</span>
                <h3 className="font-bold text-sm uppercase tracking-wider text-orange-300">
                  เกณฑ์มาตรฐานค่า BMI (เอเชีย)
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { range: "< 18.5", label: "น้ำหนักน้อย / ผอม", color: "bg-amber-400" },
                  { range: "18.5 - 22.9", label: "ปกติ สมส่วน", color: "bg-emerald-400" },
                  { range: "23.0 - 24.9", label: "น้ำหนักเกิน / ท้วม", color: "bg-orange-400" },
                  { range: "25.0 - 29.9", label: "อ้วนระดับ 1", color: "bg-red-400" },
                  { range: "≥ 30.0", label: "อ้วนระดับ 2 (อันตราย)", color: "bg-rose-600" },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
                      <span className="text-orange-100 font-medium">{row.label}</span>
                    </div>
                    <span className="font-mono font-bold text-orange-300">
                      {row.range}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BMI;
