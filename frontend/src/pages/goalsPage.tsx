import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function GoalsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // ดึง user info จาก token
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsLoggedIn(false);
      setUserInfo(null);
      return;
    }

    setIsLoggedIn(true);
    fetch("http://localhost:8080/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user info");
        return res.json();
      })
      .then(setUserInfo)
      .catch(() => {
        setIsLoggedIn(false);
        setUserInfo(null);
      });
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("authToken");
    navigate("/home");
    window.location.reload();
  }, [navigate]);

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  const toggleDropdown = useCallback(() => setShowDropdown((prev) => !prev), []);

  return (
    <div className="min-h-screen bg-[#ff7b00] text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-[#991b1b] shadow-md">
        <div className="text-3xl font-bold">
          Eat <span className="text-xl">แหลก</span>
        </div>
        <ul className="relative flex items-center space-x-4 text-sm sm:text-base font-semibold">
          <li>
            <a className="px-4 py-2" href="/home">
              หน้าหลัก
            </a>
          </li>
          <li>
            <a className="px-4 py-2" href="/bmi">
              BMI
            </a>
          </li>
          <li>
            <a className="px-4 py-2" href="/goals">
              ออกกำลังกาย
            </a>
          </li>
          {isLoggedIn && userInfo ? (
            <li className="relative">
              <button onClick={toggleDropdown} className="px-4 py-2">
                สวัสดี, {userInfo.firstname}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded shadow z-50 text-black">
                  <button
                    onClick={handleGoToProfile}
                    className="block w-full px-4 py-2 hover:bg-gray-100"
                  >
                    ข้อมูลผู้ใช้
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 hover:bg-gray-100"
                  >
                    ลงชื่อออก
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <a href="/login" className="px-4 py-2">
                ลงชื่อเข้าใช้งาน
              </a>
            </li>
          )}
        </ul>
      </nav>

      {/* Content */}
      <main className="container mx-auto max-w-screen-md px-4 py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">🎯 เป้าหมายการออกกำลังกาย</h1>
        <p className="text-lg">หน้านี้อยู่ระหว่างพัฒนา</p>
      </main>
    </div>
  );
}

export default GoalsPage;
