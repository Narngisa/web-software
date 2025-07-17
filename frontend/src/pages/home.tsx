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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    }, 1500);

    return () => clearInterval(interval);
  }, [model, labels, webcamLoading, classifyImage]);

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

  const handleLogout = useCallback(() => {
    localStorage.removeItem("authToken");
    navigate("/home");
    window.location.reload();
  }, [navigate]);

  const handleGoToProfile = () => {
    navigate('/profile');
    setShowDropdown(false);
    setIsMenuOpen(false);
  };

  const toggleDropdown = useCallback(() => setShowDropdown(prev => !prev), []);

  return (
    <div className="bg-[#ff7b00] min-h-screen text-white">
      <nav className="bg-[#991b1b] shadow-md">
        <div className="mx-auto flex items-center justify-between p-4 sm:p-6 relative">
          <div className="text-2xl font-bold">
            <a className='focus:outline-none' href="/home">
              Eat <span className="text-sm sm:text-xl">แหลก</span>
            </a>
          </div>

          {/* ปุ่ม hamburger */}
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              console.log('Toggle menu:', !isMenuOpen);
            }}
            className="sm:hidden focus:outline-none z-50"
            aria-label="Toggle menu"
            type="button"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* เมนูหลัก */}
          <ul
            className={`
              flex-col
              absolute top-full left-0 right-0
              bg-[#991b1b]
              p-4
              transition-transform duration-300 ease-in-out
              sm:flex sm:flex-row sm:items-center sm:space-x-4 sm:bg-transparent sm:p-0 sm:static sm:translate-y-0 sm:opacity-100 sm:pointer-events-auto
              ${isMenuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-20 opacity-0 pointer-events-none'}
              z-40
            `}
          >
            <li>
              <a
                href="/home"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-white hover:bg-[#7a1414] rounded sm:inline-block focus:outline-none"
              >
                หน้าหลัก
              </a>
            </li>
            <li>
              <a
                href="/bmi"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-white hover:bg-[#7a1414] rounded sm:inline-block focus:outline-none"
              >
                BMI
              </a>
            </li>
            <li>
              <a
                href="/goals"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-white hover:bg-[#7a1414] rounded sm:inline-block focus:outline-none"
              >
                ออกกำลังกาย
              </a>
            </li>
            {isLoggedIn && userInfo ? (
              <li className="relative">
                <button
                  onClick={() => {
                    toggleDropdown();
                    // ไม่ต้องปิดเมนู hamburger ตอนกดปุ่มนี้
                    // setIsMenuOpen(false);
                  }}
                  className="block px-3 py-2 text-white focus:outline-none rounded sm:inline-block whitespace-nowrap"
                >
                  สวัสดี, {userInfo.firstname}
                </button>
                {showDropdown && (
                  <div className="absolute left-0 mt-2 w-26 bg-white rounded shadow z-50 text-black">
                    <button
                      onClick={handleGoToProfile}
                      className="block w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none"
                    >
                      ข้อมูลผู้ใช้
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowDropdown(false);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 rounded hover:bg-gray-100 focus:outline-none"
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
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-white hover:bg-[#7a1414] rounded sm:inline-block focus:outline-none"
                >
                  ลงชื่อเข้าใช้งาน
                </a>
              </li>
            )}
          </ul>
        </div>
      </nav>

      <main className="container mx-auto max-w-screen-md px-4 py-8 space-y-10">
        {/* กล้อง */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">📷 ตรวจจับจากกล้อง</h2>
          <div className="w-full flex justify-center">
            <div className="w-full max-w-full sm:max-w-screen-lg aspect-[4/3] rounded-md overflow-hidden">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="bg-white text-black p-4 rounded-md shadow-md mt-4 text-center min-h-[120px]">
            {webcamLoading ? (
              <p className="text-gray-500">กำลังประมวลผล...</p>
            ) : webcamResult ? (
              <>
                <p className="text-xl sm:text-2xl text-[#991b1b] font-semibold">
                  {webcamResult} ({(webcamConfidence! * 100).toFixed(1)}%)
                </p>
                {foodInfo[webcamResult] && (
                  <p className="mt-2 text-sm sm:text-base text-gray-700">{foodInfo[webcamResult]}</p>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-sm sm:text-base">ยังไม่มีการตรวจจับ</p>
            )}
          </div>
        </section>

        {/* อัปโหลดภาพ */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">🖼 ตรวจจับจากภาพอัปโหลด</h2>
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
              className="bg-white text-black font-semibold px-3 sm:px-4 py-2 rounded shadow hover:bg-gray-200 text-sm sm:text-base w-full sm:w-auto focus:outline-none"
            >
              📤 อัปโหลดภาพอาหาร
            </button>
          </div>
          <div className="bg-white text-black p-4 rounded-md shadow-md mt-4 text-center min-h-[120px]">
            {uploadLoading ? (
              <p className="text-gray-500 text-sm sm:text-base">กำลังประมวลผล...</p>
            ) : uploadResult ? (
              <>
                <p className="text-xl sm:text-2xl text-green-700 font-semibold">
                  {uploadResult} ({(uploadConfidence! * 100).toFixed(1)}%)
                </p>
                {foodInfo[uploadResult] && (
                  <p className="mt-2 text-sm sm:text-base text-gray-700">{foodInfo[uploadResult]}</p>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-sm sm:text-base">ยังไม่มีการตรวจจับ</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
