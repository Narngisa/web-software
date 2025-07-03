import React from 'react'

function Page() {
  return (
    <div className='flex-col justify-center items-center py-16'>
      <h1 className='text-center'>BMI</h1>
      <p className='border border-red-500 py-8 mx-[32rem]'></p>
      <p className='text-center'>แคลอรี่อาหาร</p>
      <p className='border border-red-500 py-8 mx-[32rem]'></p>
      <p className='text-center'>แสดงหมู่อาหาร</p>
      <div>
        <div className='flex justify-center'>
          <p className='border border-red-500 px-16 py-8'></p>
          <p className='text-center'>โปรตีน</p>
        </div>
        <div className='flex justify-center'>
          <p className='border border-red-500 px-16 py-8'></p>
          <p className='text-center'>คาร์โบไฮเดต</p>
        </div>
        <div className='flex justify-center'>
          <p className='border border-red-500 px-16 py-8'></p>
          <p className='text-center'>เกลือแร่</p>
        </div>
        <div className='flex justify-center'>
          <p className='border border-red-500 px-16 py-8'></p>
          <p className='text-center'>วิตามิน</p>
        </div>
        <div className='flex justify-center'>
          <p className='border border-red-500 px-16 py-8'></p>
          <p className='text-center'>ไขมัน</p>
        </div>
      </div>
    </div>
  )
}

export default Page