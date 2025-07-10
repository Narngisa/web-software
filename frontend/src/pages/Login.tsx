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
                body: JSON.stringify({ email: email, password }),
            });

            if (!response.ok) {
                const errorResult = await response.json();
                setErrorMessage(errorResult.message || "Email หรือ Password ไม่ถูกต้อง");
                return;
            }

            const result = await response.json();
            console.log("Response:", result);
            setErrorMessage("");

            // ✅ เก็บ token
            localStorage.setItem("authToken", result.token);

            // ✅ ไปหน้าแรก
            navigate("/logout");

        } catch (error) {
            console.error("Error", error);
            setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
        }
    }

    return (
        <div className="bg-[#991b1b]">
            <div className="grid place-items-center h-screen text-black">
                <div className="bg-white rounded-lg p-16">
                    <h1 className="text-3xl font-bold">Login</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-[25rem] mt-10">
                        <label className="font-semibold">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            value={email}
                            placeholder="กรุณากรอกอีเมล"
                            className="bg-white border-2 border-[#ff7b00] rounded-lg p-2 focus:outline-none"
                        />
                        <label className="font-semibold">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            value={password}
                            placeholder="กรุณากรอกรหัส"
                            className="bg-white border-2 border-[#ff7b00] rounded-lg p-2 focus:outline-none"
                        />

                        {errorMessage && (
                            <div className="text-red-500 font-semibold text-sm w-[16rem]">
                                {errorMessage}
                            </div>
                        )}

                        <div className="font-semibold">
                            <p>คุณยังไม่มีบัญชี ?<a className="px-2 text-[#991b1b] underline" href="/signup">SignUp</a></p>
                        </div>

                        <button type="submit" className="font-bold rounded-lg bg-[#ff7b00] text-white w-[6rem] p-3 transform transition-transform duration-300 hover:scale-105">ล็อคอิน</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;