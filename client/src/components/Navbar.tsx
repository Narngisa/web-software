import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { href: "/home", label: "ตรวจจับอาหาร", icon: "🍱" },
    { href: "/bmi", label: "คำนวณ BMI & BMR", icon: "⚖️" },
    { href: "/goals", label: "วางแผนเป้าหมาย", icon: "🎯" },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-red-900/95 via-rose-900/90 to-amber-950/95 border-b border-orange-500/20 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with warm orange-red badge */}
          <Link
            to="/home"
            className="flex items-center gap-3 group transition-transform active:scale-95"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform duration-300">
              <span className="text-2xl">🔥</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-amber-200 transition-colors">
                Eat <span className="text-orange-400 font-bold">แหลก</span>
                <span className="text-amber-300">รู้ไหมกี่</span> Cal
              </span>
              <span className="text-[11px] text-orange-200/80 font-medium tracking-wide">
                AI Food Calorie & Fitness Coach
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex items-center space-x-2 lg:space-x-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30 ring-2 ring-orange-400/40 font-bold"
                      : "text-orange-100/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-orange-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
            aria-label="Toggle navigation"
            type="button"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`sm:hidden border-t border-orange-500/20 bg-gradient-to-b from-red-950/98 to-neutral-950/98 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2 transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "block opacity-100 translate-y-0"
            : "hidden opacity-0 -translate-y-2"
        }`}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-base transition-all ${
                isActive
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md font-bold"
                  : "text-orange-100/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
