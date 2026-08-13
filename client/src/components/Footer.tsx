import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-orange-500/20 bg-gradient-to-b from-neutral-950 to-neutral-900 text-orange-200/80 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center text-white text-base font-bold shadow-md shadow-orange-500/20">
            🔥
          </div>
          <div>
            <span className="font-bold text-white">Eat แหลกรู้ไหมกี่ Cal</span>
            <p className="text-xs text-orange-300/60">
              วิเคราะห์แคลอรี่อาหารและวางแผนโภชนาการด้วยระบบ AI
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-xs text-orange-200/70">
          <Link to="/home" className="hover:text-orange-400 transition-colors">
            ตรวจจับอาหาร
          </Link>
          <Link to="/bmi" className="hover:text-orange-400 transition-colors">
            คำนวณ BMI
          </Link>
          <Link to="/goals" className="hover:text-orange-400 transition-colors">
            เป้าหมายสุขภาพ
          </Link>
        </div>

        <p className="text-xs text-neutral-400">
          © {new Date().getFullYear()} Eat แหลก. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
