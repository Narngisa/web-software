import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        setErrorMessage(errorResult.message || "Email หรือ Password ไม่ถูกต้อง");
        return;
      }

      const result = await response.json();
      console.log("Response:", result);
      setErrorMessage("");

      localStorage.setItem("authToken", result.TOKEN);
      navigate("/home");
    } catch (error) {
      console.error("Error", error);
      setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };

  return (
    <div className="bg-[#991b1b] min-h-screen">
      <div className="grid place-items-center min-h-screen px-4 sm:px-6 text-black">
        <div className="bg-white rounded-lg p-8 sm:p-10 md:p-16 w-full max-w-md sm:max-w-lg">
          <h1 className="text-2xl sm:text-3xl font-bold text-center">Login</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-8">
                <label className="font-semibold text-sm">Email</label>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    value={email}
                    placeholder="กรุณากรอกอีเมล"
                    className="bg-white border-2 border-[#ff7b00] rounded-lg p-2 focus:outline-none text-sm"
                />
                <label className="font-semibold text-sm">Password</label>
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    value={password}
                    placeholder="กรุณากรอกรหัส"
                    className="bg-white border-2 border-[#ff7b00] rounded-lg p-2 focus:outline-none text-sm"
                />

                {errorMessage && (
                    <div className="text-red-500 font-semibold text-sm">
                        {errorMessage}
                    </div>
                )}

                <div className="font-semibold text-sm">
                    <p> คุณยังไม่มีบัญชี?<a className="px-2 text-[#991b1b] underline" href="/signup">Sign Up</a></p>
                </div>

                <button type="submit" className="font-bold rounded-lg bg-[#ff7b00] text-white w-full sm:w-[6rem] p-3 mt-2 transform transition-transform duration-300 hover:scale-105">ล็อคอิน</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
