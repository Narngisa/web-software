import React, { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { foodInfo } from "../data/foodInfo";

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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const loadedModel = await tf.loadLayersModel("/model/model.json");
        const metadata = await fetch("/model/metadata.json").then((res) =>
          res.json()
        );
        setModel(loadedModel);
        setLabels(metadata.labels || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const classifyImage = useCallback(
    async (image: tf.Tensor3D, isFromWebcam = false) => {
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
    },
    [model, labels]
  );

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

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const imageBitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(imageBitmap, 0, 0);

      const imgTensor = tf.browser.fromPixels(canvas);
      await classifyImage(imgTensor, false);
      tf.dispose(imgTensor);
    },
    [classifyImage]
  );

  return (
    <div className="bg-gradient-to-b from-[#ff7b00] to-[#ff9f43] min-h-screen text-white flex flex-col">
      {/* Navbar */}
      <nav className="backdrop-blur-md bg-[#991b1b]/90 shadow-lg sticky top-0 z-50">
        <div className="mx-auto flex items-center justify-between px-6 py-6">
          {/* โลโก้ */}
          <a
            href="/home"
            className="text-2xl font-extrabold text-white tracking-wide hover:text-yellow-300 transition-colors duration-300"
          >
            Eat <span className="text-sm sm:text-xl font-light">แหลกรู้ไหมกี่ </span>Cal
          </a>

          {/* Hamburger (มือถือเท่านั้น) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden focus:outline-none z-50 p-2 rounded-md hover:bg-white/20 transition-colors"
            aria-label="Toggle menu"
            type="button"
          >
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

          {/* เมนู */}
          <ul
            className={`
        flex-col absolute top-full left-0 right-0 bg-[#991b1b]/95 rounded-b-xl shadow-md px-6 py-4
        transform transition-all duration-300 ease-in-out
        sm:static sm:flex sm:flex-row sm:items-center sm:space-x-8 sm:bg-transparent sm:shadow-none sm:rounded-none sm:p-0
        ${
          isMenuOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-5 opacity-0 pointer-events-none sm:opacity-100 sm:translate-y-0 sm:pointer-events-auto"
        }
        z-40
      `}
          >
            {[
              { href: "/home", label: "หน้าหลัก" },
              { href: "/bmi", label: "BMI" },
              { href: "/goals", label: "ออกกำลังกาย" },
            ].map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="relative block px-3 py-2 text-white font-medium transition-colors duration-200 hover:text-yellow-300 sm:px-2 sm:py-1"
                >
                  {item.label}
                  {/* underline effect */}
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="container mx-auto max-w-screen-md px-4 py-10 space-y-10">
        {/* กล้อง */}
        <section>
          <h2 className="text-2xl font-extrabold mb-4 text-center text-white drop-shadow-lg">
            📷 ตรวจจับจากกล้อง
          </h2>
          <div className="flex justify-center">
            <div className="w-full max-w-full sm:max-w-screen-lg aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="bg-gradient-to-br from-white via-orange-50 to-white text-black p-6 rounded-3xl shadow-2xl mt-4 text-center min-h-[140px]">
            {webcamLoading ? (
              <p className="text-gray-500">กำลังประมวลผล...</p>
            ) : webcamResult ? (
              <>
                <p className="text-2xl sm:text-3xl text-[#991b1b] font-extrabold">
                  {webcamResult} ({(webcamConfidence! * 100).toFixed(1)}%)
                </p>
                {foodInfo[webcamResult] && (
                  <p className="mt-2 text-gray-700 text-sm sm:text-base">
                    {foodInfo[webcamResult]}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-sm sm:text-base">
                ยังไม่มีการตรวจจับ
              </p>
            )}
          </div>
        </section>

        {/* อัปโหลดภาพ */}
        <section>
          <h2 className="text-2xl font-extrabold mb-4 text-center text-white drop-shadow-lg">
            🖼 ตรวจจับจากภาพอัปโหลด
          </h2>
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
              className="bg-gradient-to-r from-[#991b1b] to-[#ff7b00] text-white font-extrabold px-6 py-3 rounded-3xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200"
            >
              📤 อัปโหลดภาพอาหาร
            </button>
          </div>
          <div className="bg-gradient-to-br from-white via-orange-50 to-white text-black p-6 rounded-3xl shadow-2xl mt-4 text-center min-h-[140px]">
            {uploadLoading ? (
              <p className="text-gray-500 text-sm sm:text-base">
                กำลังประมวลผล...
              </p>
            ) : uploadResult ? (
              <>
                <p className="text-2xl sm:text-3xl text-green-700 font-extrabold">
                  {uploadResult} ({(uploadConfidence! * 100).toFixed(1)}%)
                </p>
                {foodInfo[uploadResult] && (
                  <p className="mt-2 text-gray-700 text-sm sm:text-base">
                    {foodInfo[uploadResult]}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-sm sm:text-base">
                ยังไม่มีการตรวจจับ
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
