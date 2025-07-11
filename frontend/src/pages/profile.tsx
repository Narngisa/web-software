import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    birthday: "",
    sex: "",
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    setToken(token);
    fetchUserData(token);
  }, [navigate]);

  const fetchUserData = async (token: string) => {
    try {
      const res = await fetch("http://localhost:8080/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user data");
      const user = await res.json();
      setUserId(user._id);
      setFormData({
        username: user.username || "",
        email: user.email || "",
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        birthday: user.birthday ? user.birthday.split("T")[0] : "",
        sex: user.sex || "",
      });
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !userId) return;

    try {
      const res = await fetch(`http://localhost:8080/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Update failed");
      alert("ข้อมูลถูกอัปเดตเรียบร้อยแล้ว");
    } catch (err) {
      console.error("Update failed", err);
      alert("อัปเดตไม่สำเร็จ");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !userId) return;

    if (newPassword !== confirmPassword) {
      alert("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    if (!oldPassword || !newPassword) {
      alert("กรุณากรอกรหัสผ่านเก่าและรหัสผ่านใหม่");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/user/${userId}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
      }
      alert("เปลี่ยนรหัสผ่านเรียบร้อย");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      alert("เกิดข้อผิดพลาด: " + err.message);
    }
  };

  const handleCancel = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-[#a5a5a5] py-8 px-4 sm:px-6">
      <div className="w-full sm:max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md space-y-6">
        {/* SECTION: User Profile */}
        <section>
          <h2 className="text-2xl font-bold mb-4">แก้ไขข้อมูลผู้ใช้</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {[
              { label: "Username", name: "username", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "ชื่อจริง", name: "firstname", type: "text" },
              { label: "นามสกุล", name: "lastname", type: "text" },
              { label: "วันเกิด", name: "birthday", type: "date" },
            ].map((input) => (
              <div key={input.name}>
                <label className="block font-medium mb-1">{input.label}</label>
                <input
                  type={input.type}
                  name={input.name}
                  value={formData[input.name as keyof typeof formData]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            ))}

            <div>
              <label className="block font-medium mb-1">เพศ</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-around sm:items-center sm:gap-20 gap-4">
                <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    บันทึกการเปลี่ยนแปลง
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                    ยกเลิก
                </button>
            </div>
          </form>
        </section>

        {/* SECTION: Password Change */}
        <section>
          <h2 className="text-2xl font-bold mb-4">เปลี่ยนรหัสผ่าน</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">รหัสผ่านเก่า</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">รหัสผ่านใหม่</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">ยืนยันรหัสผ่านใหม่</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
            >
              เปลี่ยนรหัสผ่าน
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;
