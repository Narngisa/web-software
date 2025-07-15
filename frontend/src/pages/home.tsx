import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import { useNavigate } from "react-router-dom";
import { foodInfo } from '../data/foodInfo';

function Home() {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [labels, setLabels] = useState<string[]>([]);

  const [webcamResult, setWebcamResult] = useState<string | null>(null);
  const [webcamConfidence, setWebcamConfidence] = useState<number | null>(null);
  const [webcamLoading, setWebcamLoading] = useState(false);

  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [uploadConfidence, setUploadConfidence] = useState<number | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const loadedModel = await tf.loadLayersModel('/model/model.json');
        const metadata = await fetch('/model/metadata.json').then(res => res.json());
        setModel(loadedModel);
        setLabels(metadata.labels || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // เช็ค token และดึง user info ถ้ามี token
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsLoggedIn(false);
      setUserInfo(null);
      return;
    }

    setIsLoggedIn(true);
    fetch("http://localhost:8080/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch user info");
        return res.json();
      })
      .then(setUserInfo)
      .catch(() => {
        setUserInfo(null);
        setIsLoggedIn(false);
      });
  }, []);

  // ฟังก์ชัน classify รูปภาพ ใช้ memoize ด้วย useCallback
  const classifyImage = useCallback(async (image: tf.Tensor3D, isFromWebcam = false) => {
    if (!model || labels.length === 0) return;

    isFromWebcam ? setWebcamLoading(true) : setUploadLoading(true);

    try {
      const resized = tf.image.resizeBilinear(image, [224, 224]);
      const normalized = resized.div(255).expandDims(0);

      const prediction = model.predict(normalized) as tf.Tensor;
      const data = await prediction.data();
      const highestIndex = data.indexOf(Math.max(...data));

      if (isFromWebcam) {
        setWebcamResult(labels[highestIndex]);
        setWebcamConfidence(data[highestIndex]);
      } else {
        setUploadResult(labels[highestIndex]);
        setUploadConfidence(data[highestIndex]);
      }

      tf.dispose([resized, normalized, prediction]);
    } catch (err) {
      console.error(err);
    } finally {
      isFromWebcam ? setWebcamLoading(false) : setUploadLoading(false);
    }
  }, [model, labels]);

  // ใช้ useEffect ทำ loop ตรวจจับกล้อง แค่ถ้าไม่ loading เท่านั้น
  useEffect(() => {
    if (!model || labels.length === 0) return;

    const interval = setInterval(() => {
      if (
        !webcamLoading &&
        webcamRef.current?.video &&
        webcamRef.current.video.readyState === 4
      ) {
        const imgTensor = tf.browser.fromPixels(webcamRef.current.video);
        classifyImage(imgTensor, true);
        tf.dispose(imgTensor);
      }
    }, 1500); // ขยายเวลา 1.5 วิ ลดโหลด CPU

    return () => clearInterval(interval);
  }, [model, labels, webcamLoading, classifyImage]);

  // อัปโหลดภาพและ classify
  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(imageBitmap, 0, 0);

    const imgTensor = tf.browser.fromPixels(canvas);
    await classifyImage(imgTensor, false);
    tf.dispose(imgTensor);
  }, [classifyImage]);

  // Logout แบบ memoized
  const handleLogout = useCallback(() => {
    localStorage.removeItem("authToken");
    navigate("/home");
    window.location.reload(); // รีเฟรชหน้าเว็บ
  }, [navigate]);

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  // Toggle dropdown
  const toggleDropdown = useCallback(() => setShowDropdown(prev => !prev), []);

  return (
    <div className="bg-[#ff7b00] min-h-screen text-white">
      <nav className="flex justify-between items-center p-6 bg-[#991b1b] shadow-md">
        <div className="text-3xl font-bold">
          Eat <span className="text-xl">แหลก</span>
        </div>
        <ul className="relative flex items-center space-x-4 text-sm sm:text-base font-semibold">
          <li>
            <a className='px-4 py-2 focus:outline-none' href="/home">หน้าหลัก</a>
          </li>
          <li>
            <a className='px-4 py-2 focus:outline-none' href="/bmi">BMI</a>
          </li>
          <li>
            <a className='px-4 py-2 focus:outline-none' href="/goals">ออกกำลังกาย</a>
          </li>
          {isLoggedIn && userInfo ? (
            <li className="relative">
              <button onClick={toggleDropdown} className="px-4 py-2 focus:outline-none">
                สวัสดี, {userInfo.firstname}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded shadow z-50">
                  <button
                    onClick={handleGoToProfile}
                    className="block w-full text-left px-4 py-2 text-black hover:rounded-md hover:bg-gray-100 focus:outline-none"
                  >
                    ข้อมูลผู้ใช้
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-black hover:rounded-md hover:bg-gray-100 focus:outline-none"
                  >
                    ลงชื่อออก
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <a
                href="/login"
                className="px-4 py-2 focus:outline-none"
              >
                ลงชื่อเข้าใช้งาน
              </a>
            </li>
          )}
        </ul>
      </nav>

      <main className="container mx-auto max-w-screen-md px-4 py-8 space-y-10">
        {/* กล้อง */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-center">📷 ตรวจจับจากกล้อง</h2>
          <div className="w-full flex justify-center">
            <div className="w-full max-w-screen-lg aspect-[4/3]">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="rounded-md shadow-md w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="bg-white text-black p-4 rounded-md shadow-md mt-4 text-center min-h-[120px]">
            {webcamLoading ? (
              <p className="text-gray-500">กำลังประมวลผล...</p>
            ) : webcamResult ? (
              <>
                <p className="text-xl text-[#991b1b] font-semibold">
                  {webcamResult} ({(webcamConfidence! * 100).toFixed(1)}%)
                </p>
                {foodInfo[webcamResult] && (
                  <p className="mt-2 text-sm text-gray-700">{foodInfo[webcamResult]}</p>
                )}
              </>
            ) : (
              <p className="text-gray-500">ยังไม่มีการตรวจจับ</p>
            )}
          </div>
        </section>

        {/* อัปโหลดภาพ */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-center">🖼 ตรวจจับจากภาพอัปโหลด</h2>
          <div className="flex justify-center">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-black font-semibold px-4 py-2 rounded shadow hover:bg-gray-200"
            >
              📤 อัปโหลดภาพอาหาร
            </button>
          </div>
          <div className="bg-white text-black p-4 rounded-md shadow-md mt-4 text-center min-h-[120px]">
            {uploadLoading ? (
              <p className="text-gray-500">กำลังประมวลผล...</p>
            ) : uploadResult ? (
              <>
                <p className="text-xl text-green-700 font-semibold">
                  {uploadResult} ({(uploadConfidence! * 100).toFixed(1)}%)
                </p>
                {foodInfo[uploadResult] && (
                  <p className="mt-2 text-sm text-gray-700">{foodInfo[uploadResult]}</p>
                )}
              </>
            ) : (
              <p className="text-gray-500">ยังไม่มีการตรวจจับ</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
