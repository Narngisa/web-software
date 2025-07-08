import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ gmail: email, password }), // 👈 ต้องใช้ gmail ตาม backend
            });

            const result = await response.json();
            console.log("Response from Flask:", result);

            if (response.ok) {
                navigate("/home");
            } else {
                alert(result.message || "Login failed");
            }
        } catch (error) {
            console.error("Error sending data to Flask:", error);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
        }
    };

    return (
        <div>
            <div>
                <h1>Login</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <span>Gmail</span>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    value={email}
                    placeholder="กรุณากรอก Gmail"
                />
                <span>Password</span>
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    value={password}
                    placeholder="กรุณากรอก Password"
                />
                <button className="text-white font-bold cursor-pointer px-6 py-2 rounded-lg">Submit</button>
            </form>
        </div>
    )
}

export default Login