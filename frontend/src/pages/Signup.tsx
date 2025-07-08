import { useState } from "react";

function Login() {

    const [username, setUsername] = useState("");
    const [gmail, setgmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [birthday, setBirthday] = useState("");
    const [sex, setSex] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                gmail, 
                password,
                firstname,
                lastname,
                birthday,
                sex,
            }),
            });

            const result = await response.json();
            console.log("Response from Flask:", result);
        } catch (error) {
            console.error("Error sending data to Flask:", error);
        }
        };

    return (
        <div>
            <div>
                <h1>Login</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <span>Username</span>
                <input
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    value={username}
                    placeholder="กรุณากรอกอีเมล"
                />
                <span>gmail</span>
                <input
                    onChange={(e) => setgmail(e.target.value)}
                    type="gmail"
                    value={gmail}
                    placeholder="กรุณากรอกอีเมล"
                />
                <span>Password</span>
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    value={password}
                    placeholder="กรุณากรอกรหัส"
                />
                <span>Firstname</span>
                <input
                    onChange={(e) => setFirstname(e.target.value)}
                    type="text"
                    value={firstname}
                    placeholder="กรุณากรอกชื่อ"
                />
                <span>Lastname</span>
                <input
                    onChange={(e) => setLastname(e.target.value)}
                    type="text"
                    value={lastname}
                    placeholder="กรุณากรอกนามสกุล"
                />
                <span>Birthday</span>
                <input
                    onChange={(e) => setBirthday(e.target.value)}
                    type="date"
                    value={birthday}
                    placeholder="กรุณากรอกวันเกิด"
                />
                <span>Sex</span>
                <input
                    onChange={(e) => setSex(e.target.value)}
                    type="text"
                    value={sex}
                    placeholder="กรุณากรอกเพศ (เพศตามสภาพโดยแต่กำเนิด)"
                />
                <button className="text-white font-bold cursor-pointer px-6 py-2 rounded-lg">Submit</button>
            </form>
        </div>
    )
}

export default Login