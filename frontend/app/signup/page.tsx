"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [sex, setSex] = useState("");

  return (
    <div className="grid place-items-center h-full bg-[#FCF8E8] py-16">
      <div className="shadow-lg p-5 rounded-lg border-t-4 bg-[#faf7ed] border-amber-900">
        <h1 className="text-xl font-bold my-4 text-amber-900">Sign up</h1>
        <form className="flex flex-col gap-3 w-[25rem] text-amber-900">
            <span>Email</span>
            <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                value={email}
                placeholder="กรุณากรอกอีเมล"
                className="p-3"
            />
            <span>Password</span>
            <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                value={password}
                placeholder="กรุณากรอกรหัส"
                className="p-3"
            />
            <span>Firstname</span>
            <input
                onChange={(e) => setFirstname(e.target.value)}
                type="text"
                value={firstname}
                placeholder="กรุณากรอกชื่อ"
                className="p-3"
            />
            <span>Lastname</span>
            <input
                onChange={(e) => setLastname(e.target.value)}
                type="text"
                value={lastname}
                placeholder="กรุณากรอกนามสกุล"
                className="p-3"
            />
            <span>Birthday</span>
            <input
                onChange={(e) => setBirthday(e.target.value)}
                type="date"
                value={birthday}
                placeholder="กรุณากรอกวันเกิด"
                className="p-3"
            />
            <span>Sex</span>
            <input
                onChange={(e) => setSex(e.target.value)}
                type="text"
                value={sex}
                placeholder="กรุณากรอกเพศ (เพศตามสภาพโดยแต่กำเนิด)"
                className="p-3"
            />
          <button className="bg-amber-900 text-white font-bold cursor-pointer px-6 py-2 rounded-lg">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Page;