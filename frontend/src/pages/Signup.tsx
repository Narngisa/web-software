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
        <div className="bg-[#acdfac]">
            <div className="grid place-items-center h-screen text-[#72bb72]">
                <div className="bg-white rounded-lg p-16">
                    <h1 className="text-3xl font-bold">Signup</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-[25rem] mt-10">
                        <span className="font-semibold">Username</span>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            value={username}
                            placeholder="กรุณากรอกอีเมล"
                            className="bg-white border-2 border-[#72bb72] rounded-lg p-2 focus:outline-none"
                        />
                        <span className="font-semibold">email</span>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            value={email}
                            placeholder="กรุณากรอกอีเมล"
                            className="bg-white border-2 border-[#72bb72] rounded-lg p-2 focus:outline-none"
                        />
                        <span className="font-semibold">Password</span>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            value={password}
                            placeholder="กรุณากรอกรหัส"
                            className="bg-white border-2 border-[#72bb72] rounded-lg p-2 focus:outline-none"
                        />
                        <span className="font-semibold">Firstname</span>
                        <input
                            onChange={(e) => setFirstname(e.target.value)}
                            type="text"
                            value={firstname}
                            placeholder="กรุณากรอกชื่อ"
                            className="bg-white border-2 border-[#72bb72] rounded-lg p-2 focus:outline-none"
                        />
                        <span className="font-semibold">Lastname</span>
                        <input
                            onChange={(e) => setLastname(e.target.value)}
                            type="text"
                            value={lastname}
                            placeholder="กรุณากรอกนามสกุล"
                            className="bg-white border-2 border-[#72bb72] rounded-lg p-2 focus:outline-none"
                        />
                        <span className="font-semibold">Birthday</span>
                        <input
                            onChange={(e) => setBirthday(e.target.value)}
                            type="date"
                            value={birthday}
                            placeholder="กรุณากรอกวันเกิด"
                            className="bg-white border-2 border-[#72bb72] rounded-lg p-2 focus:outline-none"
                        />
                        <span className="font-semibold">Sex</span>
                        <input
                            onChange={(e) => setSex(e.target.value)}
                            type="text"
                            value={sex}
                            placeholder="กรุณากรอกเพศ (เพศตามสภาพโดยแต่กำเนิด)"
                            className="bg-white border-2 border-[#72bb72] rounded-lg p-2 focus:outline-none"
                        />
                        {errorMessage && (
                            <div className="text-red-500 font-semibold text-sm w-[16rem]">
                                {errorMessage}
                            </div>
                        )}

                        <button type="submit" className="font-bold rounded-lg bg-[#72bb72] text-white w-[6rem] p-3 transform transition-transform duration-300 hover:scale-105">ตกลง</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup