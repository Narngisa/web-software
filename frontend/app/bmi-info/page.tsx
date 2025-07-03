"use client"

import React, { useState } from 'react'

function Page() {
  const [age, setAge] = useState<number | null>();
  const [sex, setSex] = useState<string | null>("");
  const [height, setHeight] = useState<number | null>();
  const [weight, setWeight] = useState<number | null>();

  return (
    <div className='text-amber-900'>
      <div>
        <nav>
          <div className='flex justify-between items-center bg-[#FCF8E8] px-8 py-4'>
            <h1 className='text-2xl font-semibold px-5'>Test</h1>
            <ul className='flex space-x-4'>
              <a href="">Home</a>
              <a href="">Calorie</a>
              <a href="">Exercise</a>
            </ul>
          </div>
        </nav>
      </div>

      <div>
        <h1 className='text-3xl text-center mt-35'>BMI Information</h1>
        <p className='text-center mt-2'>กรุณากรอกข้อมูลส่วนตัวของคุณเพื่อคำนวณค่า BMI</p>
      </div>

      <div>
        <form className='grid grid-flow-row grid-rows-1 px-15 mt-10'>
          <span className='px-4'>อายุ</span>
          <input
            className='border-2 rounded-2xl p-2 my-2'
            placeholder='กรุณากรอกอายุ'
            type="number"
            value={age ?? ""}
            onChange={e => setAge(e.target.value === "" ? null : Number(e.target.value))}
          />
          <span className='px-4'>เพศ</span>
          <input
            className='border-2 rounded-2xl p-2 my-2'
            placeholder='กรุณากรอกเพศ'
            type="text"
            value={sex ?? ""}
            onChange={e => setSex(e.target.value)}
          />
          <span className='px-4'>ส่วนสูง</span>
          <input
            className='border-2 rounded-2xl p-2 my-2'
            placeholder='กรุณากรอกส่วนสูง (เซนติเมตร)'
            type="number"
            value={height ?? ""}
            onChange={e => setHeight(e.target.value === "" ? null : Number(e.target.value))}
          />
          <span className='px-4'>น้ำหนัก</span>
          <input
            className='border-2 rounded-2xl p-2 my-2'
            placeholder='กรุณากรอกน้ำหนัก (กิโลกรัม)'
            type="number"
            value={weight ?? ""}
            onChange={e => setWeight(e.target.value === "" ? null : Number(e.target.value))}
          />
          <button className='p-3 border-2 border-amber-900 bg-[#FCF8E8] rounded-xl mt-5'>Submit</button>
        </form>
      </div>
    </div>
  )
}

export default Page