import { useRef, useState } from 'react';
import Webcam from 'react-webcam';

function Home() {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);

  const capture = () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      setImage(screenshot);
    }
  };

  return (
    <div className='bg-[#ff7b00]'>
        <nav className='flex justify-between items-center p-8 bg-[#991b1b] text-white'>
            <div>
                <span className='text-4xl font-bold'>Eat </span>
                <span className='text-2xl font-bold'>แหลก</span>
            </div>

            <ul className='flex space-x-4 font-semibold'>
                <a href=""></a>
                <a href=""></a>
                <a href="">ลงชื่อเข้าใช้งาน</a>
            </ul>
        </nav>
        <h2>กล้องเว็บแคม</h2>
        <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={420}
            height={340}
        />
        <br />
        <button onClick={capture}>ถ่ายรูป</button>
        {image && (
            <div>
            <h3>รูปที่ถ่าย:</h3>
            <img src={image} alt="ถ่ายจากกล้อง" />
            </div>
        )}
    </div>
  );
}

export default Home;