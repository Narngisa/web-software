import { useState } from "react";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface PlanResult {
  bmi: number;
  bmr: number;
  tdee: number;
  targetCalories: number;
  recommendation: string;
  protein: number;
  carbs: number;
  fat: number;
  foodSuggestion: string;
}

function GoalsPage() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("ชาย");
  const [goal, setGoal] = useState<"lose" | "gain" | "maintain">("lose");
  const [targetWeight, setTargetWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [planResult, setPlanResult] = useState<PlanResult | null>(null);

  const activityOptions = [
    { value: "sedentary", label: "นั่งทำงาน ไม่ค่อยออกกำลังกาย", factor: 1.2, icon: "🪑" },
    { value: "light", label: "ออกกำลังกายเบาๆ 1-3 วัน/สัปดาห์", factor: 1.375, icon: "🚶" },
    { value: "moderate", label: "ออกกำลังกายปานกลาง 3-5 วัน/สัปดาห์", factor: 1.55, icon: "🏃" },
    { value: "active", label: "ออกกำลังกายหนัก 6-7 วัน/สัปดาห์", factor: 1.725, icon: "🏋️" },
    { value: "veryActive", label: "ออกกำลังกายหนักมาก + ทำงานใช้แรง", factor: 1.9, icon: "⚡" },
  ];

  const goalOptions: { id: "lose" | "gain" | "maintain"; title: string; desc: string; icon: string }[] = [
    { id: "lose", title: "ลดไขมัน", desc: "ลดน้ำหนัก กระชับสัดส่วน", icon: "🔥" },
    { id: "gain", title: "เพิ่มกล้ามเนื้อ", desc: "เพิ่มน้ำหนัก เสริมสร้างกล้าม", icon: "💪" },
    { id: "maintain", title: "คงรูปร่าง", desc: "สุขภาพแข็งแรง รักษาสมดุล", icon: "⚖️" },
  ];

  const calculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age, 10);

    if (!h || !w || !a || h <= 0 || w <= 0 || a <= 0) {
      Swal.fire({
        icon: "warning",
        title: "กรอกข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกส่วนสูง น้ำหนัก และอายุให้ถูกต้อง",
        confirmButtonColor: "#ea580c",
      });
      return;
    }

    const bmiCalc = w / (h / 100) ** 2;
    const bmrCalc =
      gender === "ชาย"
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;

    const currentActivity = activityOptions.find((o) => o.value === activityLevel);
    const activityFactor = currentActivity ? currentActivity.factor : 1.55;
    const tdee = bmrCalc * activityFactor;

    let targetCalories = tdee;
    let recommendation = "";
    const targetKg = targetWeight ? parseFloat(targetWeight) : null;

    if (goal === "lose") {
      targetCalories = tdee - 500;
      recommendation = `ลดไขมัน${
        targetKg !== null && !isNaN(targetKg) ? ` (เป้าหมาย ${targetKg} กก.)` : ""
      } รับประทานวันละประมาณ ${Math.round(
        targetCalories
      )} kcal พร้อมคาร์ดิโอ & เวทเทรนนิ่ง 3-5 วัน/สัปดาห์`;
    } else if (goal === "gain") {
      targetCalories = tdee + 400;
      recommendation = `เพิ่มกล้ามเนื้อ${
        targetKg !== null && !isNaN(targetKg) ? ` (เป้าหมาย ${targetKg} กก.)` : ""
      } รับประทานวันละประมาณ ${Math.round(
        targetCalories
      )} kcal พร้อมเวทเทรนนิ่งเน้นหนัก 4-6 วัน/สัปดาห์`;
    } else {
      recommendation = `คงรูปร่าง: รับประทานวันละประมาณ ${Math.round(
        targetCalories
      )} kcal รักษาสมดุลพลังงานและออกกำลังกายสม่ำเสมอ`;
    }

    const proteinPerKg = goal === "gain" ? 2.0 : 1.6;
    const protein = Math.round(proteinPerKg * w);
    const fatCalories = targetCalories * 0.25;
    const fat = Math.round(fatCalories / 9);
    const carbsCalories = Math.max(0, targetCalories - (protein * 4 + fat * 9));
    const carbs = Math.round(carbsCalories / 4);

    const foodOptionsList: Record<string, string[]> = {
      lose: [
        "อกไก่ย่างสมุนไพร + ข้าวไรซ์เบอร์รี่ + สลัดผักน้ำใส + ไข่ต้ม 1 ฟอง",
        "ปลากะพงนึ่งซีอิ๊ว + ผักต้มรวมมิตร + ข้าวกล้อง",
        "กรีกโยเกิร์ตผลไม้ตระกูลเบอร์รี่ + สลัดทูน่าในน้ำแร่ + อัลมอนด์อบ",
      ],
      gain: [
        "สเต็กเนื้อสันนอก + มันฝรั่งอบ + บรอกโคลี + เวย์โปรตีนเชค",
        "ข้าวกล้อง + อกไก่ย่างดับเบิ้ล + ไข่คน 3 ฟอง + อะโวคาโด",
        "ข้าวผัดแซลมอนใส่ไข่ + ผักรวม + นมจืดไขมันเต็ม",
      ],
      maintain: [
        "ข้าวกล้อง + ไก่ผัดขิง + ต้มจืดเต้าหู้หมูสับ + สลัดผักรวม",
        "สเต็กอกไก่ + สปาเกตตีผัดพริกแห้งน้ำมันมะกอก + สลัดผัก",
        "ปลานึ่งมะนาว + ข้าวหอมมะลิ + ผัดผักกาดขาว",
      ],
    };
    const foodList = foodOptionsList[goal];
    const food = foodList[Math.floor(Math.random() * foodList.length)];

    const result: PlanResult = {
      bmi: bmiCalc,
      bmr: bmrCalc,
      tdee,
      targetCalories: Math.round(targetCalories),
      recommendation,
      protein,
      carbs,
      fat,
      foodSuggestion: food,
    };

    setPlanResult(result);

    Swal.fire({
      title:
        '<span style="color:#991b1b; font-size:1.6rem; font-weight:800;">🎯 แผนโภชนาการของคุณ</span>',
      html: `
        <div style="text-align:left; font-size: 0.95rem; color: #374151; line-height: 1.7;">
          <div style="background: #fff7ed; padding: 12px 16px; border-radius: 12px; border: 1px solid #fdba74; margin-bottom: 12px;">
            <p style="margin:0;"><strong>เป้าหมายพลังงาน:</strong> <span style="font-size:1.4rem; font-weight:bold; color:#dc2626;">${Math.round(
              targetCalories
            )}</span> kcal/วัน</p>
            <p style="margin:4px 0 0 0; color:#ea580c; font-size:0.9rem;">(BMR: ${Math.round(
              bmrCalc
            )} | TDEE: ${Math.round(tdee)})</p>
          </div>
          <p style="margin:8px 0;"><strong>สัดส่วนสารอาหาร (Macros):</strong></p>
          <div style="display:flex; gap:8px; margin-bottom:12px;">
            <span style="background:#fee2e2; color:#991b1b; padding:4px 8px; border-radius:8px; font-weight:bold; font-size:0.85rem;">🍗 โปรตีน: ${protein}g</span>
            <span style="background:#ffedd5; color:#9a3412; padding:4px 8px; border-radius:8px; font-weight:bold; font-size:0.85rem;">🍚 คาร์บ: ${carbs}g</span>
            <span style="background:#fef3c7; color:#92400e; padding:4px 8px; border-radius:8px; font-weight:bold; font-size:0.85rem;">🥑 ไขมัน: ${fat}g</span>
          </div>
          <p style="margin:8px 0;"><strong>คำแนะนำเมนู:</strong> ${food}</p>
        </div>
      `,
      icon: "success",
      width: 550,
      padding: "2rem",
      background: "#ffffff",
      confirmButtonText: "รับทราบแผน",
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
            <span>🎯</span> Personalized Nutrition & Fitness Planner
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            วางแผนเป้าหมาย <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-red-500 bg-clip-text text-transparent">สุขภาพ & แคลอรี่</span>
          </h1>
          <p className="mt-2 text-sm text-orange-200/80">
            คำนวณแคลอรี่ที่ควรได้รับต่อวัน (TDEE) พร้อมสัดส่วนโปรตีน คาร์บ ไขมัน และเมนูอาหารแนะนำ
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Planner Form */}
          <div className="lg:col-span-7 bg-gradient-to-br from-white via-orange-50 to-amber-50 rounded-3xl shadow-2xl p-6 sm:p-8 text-neutral-900 border border-orange-200 space-y-6">
            <div className="flex items-center gap-3 border-b border-orange-200/80 pb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center text-white text-xl shadow-md">
                ⚙️
              </div>
              <div>
                <h2 className="text-xl font-black text-red-950">
                  ตั้งค่าข้อมูลเป้าหมายของคุณ
                </h2>
                <p className="text-xs text-neutral-500">
                  กรอกรายละเอียดเพื่อคำนวณพลังงานที่ร่างกายต้องการอย่างแม่นยำ
                </p>
              </div>
            </div>

            {/* Goal Choice Selection */}
            <div>
              <label className="block text-sm font-bold text-neutral-800 mb-2">
                เลือกเป้าหมายสุขภาพ <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {goalOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGoal(item.id)}
                    className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all duration-200 ${
                      goal === item.id
                        ? "bg-gradient-to-br from-orange-500 to-red-600 text-white border-transparent shadow-lg shadow-orange-500/30 scale-[1.02] font-bold"
                        : "bg-white text-neutral-700 border-orange-200 hover:bg-orange-50"
                    }`}
                  >
                    <span className="text-2xl mb-1">{item.icon}</span>
                    <span className="text-xs sm:text-sm font-bold">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Body Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  ส่วนสูง (ซม.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="เช่น 170"
                  className="w-full px-3.5 py-3 bg-white border border-orange-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  น้ำหนักปัจจุบัน (กก.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="เช่น 65"
                  className="w-full px-3.5 py-3 bg-white border border-orange-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  อายุ (ปี) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="เช่น 25"
                  className="w-full px-3.5 py-3 bg-white border border-orange-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm shadow-sm"
                />
              </div>
            </div>

            {/* Gender and Target Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  เพศ
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-3 bg-white border border-orange-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm shadow-sm font-medium"
                >
                  <option value="ชาย">ชาย</option>
                  <option value="หญิง">หญิง</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  น้ำหนักเป้าหมาย (กก. ถ้ามี)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  placeholder="เช่น 60"
                  className="w-full px-3.5 py-3 bg-white border border-orange-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm shadow-sm"
                />
              </div>
            </div>

            {/* Activity Level Selector */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                ระดับกิจกรรมในแต่ละวัน
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full px-3.5 py-3 bg-white border border-orange-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm shadow-sm font-medium"
              >
                {activityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-red-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-orange-600/30 hover:shadow-orange-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              🔥 คำนวณแผนโภชนาการและแคลอรี่
            </button>
          </div>

          {/* Results Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            {planResult ? (
              <div className="bg-gradient-to-br from-orange-950/80 to-red-950/80 rounded-3xl p-6 border-2 border-orange-500/40 shadow-2xl backdrop-blur-xl animate-fade-in space-y-4">
                <div className="flex items-center gap-2 border-b border-orange-500/30 pb-3">
                  <span className="text-2xl">✨</span>
                  <h3 className="font-extrabold text-lg text-orange-200">
                    แผนสุขภาพเฉพาะคุณ
                  </h3>
                </div>

                {/* Calorie Target Highlight */}
                <div className="p-4 rounded-2xl bg-black/40 border border-orange-500/30 text-center">
                  <span className="text-xs text-orange-300/80 font-semibold">
                    พลังงานที่ควรได้รับต่อวัน
                  </span>
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 mt-1">
                    {planResult.targetCalories}
                  </p>
                  <span className="text-xs text-orange-200/70">
                    แคลอรี่ (kcal / day)
                  </span>
                </div>

                {/* Macro breakdown badges */}
                <div>
                  <h4 className="text-xs font-bold text-orange-300 mb-2">
                    สัดส่วนสารอาหารหลัก (Macronutrients)
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-red-900/40 border border-red-500/30">
                      <span className="text-[11px] text-red-200 block font-medium">🍗 โปรตีน</span>
                      <span className="font-black text-base text-white">{planResult.protein}g</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-orange-900/40 border border-orange-500/30">
                      <span className="text-[11px] text-orange-200 block font-medium">🍚 คาร์บ</span>
                      <span className="font-black text-base text-white">{planResult.carbs}g</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-900/40 border border-amber-500/30">
                      <span className="text-[11px] text-amber-200 block font-medium">🥑 ไขมัน</span>
                      <span className="font-black text-base text-white">{planResult.fat}g</span>
                    </div>
                  </div>
                </div>

                {/* Food Suggestion */}
                <div className="p-4 rounded-2xl bg-orange-900/30 border border-orange-500/20 text-xs leading-relaxed text-orange-100">
                  <strong className="text-amber-300 block mb-1">🥗 ไอเดียเมนูแนะนำประจำมื้อ:</strong>
                  {planResult.foodSuggestion}
                </div>
              </div>
            ) : (
              <div className="bg-neutral-900/70 rounded-3xl p-6 border border-orange-500/20 text-center shadow-xl backdrop-blur-md">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-3xl mb-3">
                  🎯
                </div>
                <h3 className="font-bold text-base text-orange-200 mb-1">
                  ยังไม่ได้คำนวณแผน
                </h3>
                <p className="text-xs text-orange-200/60">
                  กรอกข้อมูลทางด้านซ้ายแล้วกดปุ่ม "คำนวณแผนโภชนาการ" เพื่อดูสรุปแคลอรี่และสารอาหาร
                </p>
              </div>
            )}

            {/* Nutrition Wisdom Card */}
            <div className="bg-gradient-to-r from-red-950/60 to-orange-950/60 rounded-3xl p-5 border border-orange-500/20 text-xs text-orange-200/80 space-y-2">
              <span className="font-bold text-orange-300 flex items-center gap-1.5 text-sm">
                💡 เคล็ดลับโภชนาการ
              </span>
              <p>
                • ดื่มน้ำเปล่าอย่างน้อย 2-3 ลิตรต่อวัน เพื่อกระตุ้นระบบเผาผลาญ
              </p>
              <p>
                • เน้นโปรตีนในทุกมื้ออาหารเพื่อรักษาและเสริมสร้างมวลกล้ามเนื้อ
              </p>
              <p>
                • นอนหลับพักผ่อนให้เพียงพอ 7-8 ชั่วโมง เพื่อควบคุมฮอร์โมนความหิว
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default GoalsPage;
