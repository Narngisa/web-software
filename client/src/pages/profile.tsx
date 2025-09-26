import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  birthday: string;
  gender: string;
};

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_BASE_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
        }

        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEdit = () => navigate("/edit-profile");
  const handleHome = () => navigate("/home");

  if (error) {
    return <div className="text-red-600 font-medium p-4">❌ {error}</div>;
  }

  if (!user) {
    return <div className="p-4">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="min-h-screen bg-[#a5a5a5] flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center text-black mb-6">
          โปรไฟล์ของคุณ
        </h2>
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <ProfileItem label="Username" value={user.username} />
          <ProfileItem label="Email" value={user.email} />
          <ProfileItem label="ชื่อจริง" value={user.firstname} />
          <ProfileItem label="นามสกุล" value={user.lastname} />
          <ProfileItem label="วันเกิด" value={user.birthday?.split("T")[0]} />
          <ProfileItem label="เพศ" value={user.gender} />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md w-full sm:w-auto transition-all"
          >
            ✏️ แก้ไขข้อมูล
          </button>
          <button
            onClick={handleHome}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md w-full sm:w-auto transition-all"
          >
            🏠 หน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
}

// ✅ ชิ้นส่วนแยกสำหรับรายการโปรไฟล์ (ดูสวยและจัดระเบียบ)
const ProfileItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center border-b pb-2">
    <span className="font-semibold text-gray-800">{label}</span>
    <span className="text-gray-600">{value}</span>
  </div>
);

export default Profile;
