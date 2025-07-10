import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [birthday, setBirthday] = useState("");
    const [sex, setSex] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ✅ Validate ก่อนส่งข้อมูล
        if (!username || !email || !password || !firstname || !lastname || !birthday || !sex) {
        setErrorMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง");
        return;
        }

        if (!isValidEmail(email)) {
        setErrorMessage("รูปแบบอีเมลไม่ถูกต้อง");
        return;
        }

        if (password.length < 8) {
        setErrorMessage("รหัสผ่านควรมีอย่างน้อย 8 ตัวอักษร");
        return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/signup", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    firstname,
                    lastname,
                    birthday,
                    sex,
                }),
            });

            console.log(response)

            const result = await response.json();

            console.log("Status:", response.status);
            console.log("Response JSON:", result);

            if (!response.ok) {
                const fallbackMessage = `Signup failed (${response.status})`;
                setErrorMessage(result.message || fallbackMessage);
                return;
            }

            console.log("Response:", result);
            setErrorMessage("");
            navigate("/logout");

        } catch (error) {
            console.error("Error", error);
            setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
        }
    };

    return (
        <div className="bg-[#991b1b]">
            <div className="grid place-items-center min-h-screen text-black px-4 sm:px-6">
                <div className="bg-white rounded-lg p-8 sm:p-10 md:p-16 w-full max-w-md sm:max-w-lg">
                    <h1 className="text-2xl sm:text-3xl font-bold text-center">Sign Up</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-8">
                        <label className="font-semibold text-sm">Username</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            value={username}
                            placeholder="กรุณากรอกชื่อผู้ใช้"
                            className="bg-white border-2 border-[#ff7b00] rounded-lg p-2 focus:outline-none text-sm"
                        />
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
                        <label className="font-semibold text-sm">Firstname</label>
                        <input
                            onChange={(e) => setFirstname(e.target.value)}
                            type="text"
                            value={firstname}
                            placeholder="กรุณากรอกชื่อ"
                            className="bg-white border-2 border-[#ff7b00] rounded-lg p-2 focus:outline-none text-sm"
                        />
                        <label className="font-semibold text-sm">Lastname</label>
                        <input
                            onChange={(e) => setLastname(e.target.value)}
                            type="text"
                            value={lastname}
                            placeholder="กรุณากรอกนามสกุล"
                            className="bg-white border-2 border-[#ff7b00] rounded-lg p-2 focus:outline-none text-sm"
                        />
                        <label className="font-semibold text-sm">Birthday</label>
                        <input
                            onChange={(e) => setBirthday(e.target.value)}
                            type="date"
                            value={birthday}
                            className="bg-white border-2 border-[#ff7b00] rounded-lg p-2 focus:outline-none text-sm"
                        />
                        <label className="font-semibold text-sm">Sex</label>
                        <input
                            onChange={(e) => setSex(e.target.value)}
                            type="text"
                            value={sex}
                            placeholder="กรุณากรอกเพศ (เพศตามสภาพโดยแต่กำเนิด)"
                            className="bg-white border-2 border-[#ff7b00] rounded-lg p-2 focus:outline-none text-sm"
                        />

                        {errorMessage && (
                            <div className="text-red-500 font-semibold text-sm">
                                {errorMessage}
                            </div>
                        )}

                        <div className="text-sm font-semibold">
                            <p>คุณมีบัญชีอยู่แล้ว ?<a className="px-2 text-[#991b1b] underline" href="/login">Login</a></p>
                        </div>

                        <button type="submit" className="font-bold rounded-lg bg-[#ff7b00] text-white w-full sm:w-[8rem] p-3 transform transition-transform duration-300 hover:scale-105">สร้างบัญชี</button>
                    </form>
                </div>
            </div>
            </div>
    )
}

export default Signup