import React from 'react'

function Page() {
  return (
    <div>
        <div className='text-black'>
            <h1>อายุ</h1>
            <input className='border-1 border-black' type="text" />
            <h1>เพศ</h1>
            <input className='border-1 border-black' type="text" />
            <h1>ส่วนสูง</h1>
            <input className='border-1 border-black' type="text" />
            <h1>น้ำหนัก</h1>
            <input className='border-1 border-black' type="text" />
        </div>

        <button className='p-3 bg-green-300 rounded-lg mt-5'>Submit</button>
    </div>
  )
}

export default Page