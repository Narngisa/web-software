import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    birthday: "",
    gender: "",
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
        gender: user.gender || "",
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

    const hasEmpty = Object.values(formData).some((val) => val.trim() === "");
    if (hasEmpty) {
      setMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      setMessageType("error");
      return;
    }

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

      navigate("/profile");
    } catch (err) {
      console.error("Update failed", err);
      setMessage("อัปเดตไม่สำเร็จ");
      setMessageType("error");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !userId) return;

    if (!oldPassword || !newPassword) {
      setMessage("กรุณากรอกรหัสผ่านเก่าและรหัสผ่านใหม่");
      setMessageType("error");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("รหัสผ่านใหม่ไม่ตรงกัน");
      setMessageType("error");
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
        setMessage(data.error || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
        setMessageType("error");
        return;
      }

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      navigate("/profile");
    } catch (err: any) {
      setMessage("เกิดข้อผิดพลาด: " + err.message);
      setMessageType("error");
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-[#a5a5a5] py-8 px-4 sm:px-6">
      <div className="w-full sm:max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md space-y-10">
        {/* User Info Form */}
        <section>
          <h2 className="text-2xl font-bold mb-4">แก้ไขข้อมูลผู้ใช้</h2>
          {message && messageType !== "" && (
            <div
              className={`text-sm font-medium px-4 py-2 rounded-md mb-2 ${
                messageType === "success"
                  ? "text-green-700 bg-green-100"
                  : "text-red-700 bg-red-100"
              }`}
            >
              {message}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {[
              { name: "username", label: "Username" },
              { name: "email", label: "Email" },
              { name: "firstname", label: "ชื่อจริง" },
              { name: "lastname", label: "นามสกุล" },
              { name: "birthday", label: "วันเกิด", type: "date" },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label className="block font-medium mb-1">{label}</label>
                <input
                  type={type || (name === "email" ? "email" : "text")}
                  name={name}
                  value={formData[name as keyof typeof formData]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            ))}
            <div>
              <label className="block font-medium mb-1">เพศ</label>
              <select
                name="gender"
                value={formData.gender}
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
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
              >
                บันทึกการเปลี่ยนแปลง
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </section>

        {/* Password Change */}
        <section>
          <h2 className="text-2xl font-bold mb-4">เปลี่ยนรหัสผ่าน</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[
              { label: "รหัสผ่านเก่า", value: oldPassword, setter: setOldPassword },
              { label: "รหัสผ่านใหม่", value: newPassword, setter: setNewPassword },
              { label: "ยืนยันรหัสผ่านใหม่", value: confirmPassword, setter: setConfirmPassword },
            ].map(({ label, value, setter }, idx) => (
              <div key={idx}>
                <label className="block font-medium mb-1">{label}</label>
                <input
                  type="password"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 focus:outline-none"
            >
              เปลี่ยนรหัสผ่าน
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default EditProfile;
