import React, { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { foodInfo } from "../data/foodInfo";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [modelLoading, setModelLoading] = useState(true);

  const [webcamResult, setWebcamResult] = useState<string | null>(null);
  const [webcamConfidence, setWebcamConfidence] = useState<number | null>(null);
  const [webcamLoading, setWebcamLoading] = useState(false);

  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [uploadConfidence, setUploadConfidence] = useState<number | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [activeMode, setActiveMode] = useState<"camera" | "upload">("camera");

  useEffect(() => {
    (async () => {
      try {
        setModelLoading(true);
        const loadedModel = await tf.loadLayersModel("/model/model.json");
        const metadata = await fetch("/model/metadata.json").then((res) =>
          res.json()
        );
        setModel(loadedModel);
        setLabels(metadata.labels || []);
      } catch (e) {
        console.error(e);
      } finally {
        setModelLoading(false);
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
    if (!model || labels.length === 0 || activeMode !== "camera") return;

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
  }, [model, labels, webcamLoading, classifyImage, activeMode]);

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

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
    <div className="min-h-screen bg-gradient-to-b from-[#1a0808] via-[#2a0e07] to-[#120505] text-white flex flex-col selection:bg-orange-500 selection:text-white">
      <Navbar />

      {/* Hero Banner with Warm Orange & Red glow */}
      <section className="relative overflow-hidden pt-8 pb-6 px-4">
        {/* Background radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 sm:w-[650px] h-72 bg-gradient-to-tr from-orange-600/30 via-red-600/25 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-300 text-xs sm:text-sm font-semibold mb-4 backdrop-blur-md shadow-lg shadow-orange-950/40">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
            AI Computer Vision Model v1.0
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
            สแกนอาหาร รู้ทัน <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-red-500 bg-clip-text text-transparent">แคลอรี่</span> ทันที
          </h1>
          <p className="mt-3 text-sm sm:text-base text-orange-200/80 max-w-2xl mx-auto font-normal">
            ตรวจจับเมนูอาหารอัตโนมัติด้วยระบบกล้องและภาพถ่าย พร้อมข้อมูลแคลอรี่และสารอาหารเพื่อสุขภาพที่ดีของคุณ
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mt-6 inline-flex p-1.5 bg-neutral-900/80 backdrop-blur-md rounded-2xl border border-orange-500/25 shadow-xl">
            <button
              onClick={() => setActiveMode("camera")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeMode === "camera"
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-600/40 scale-100"
                  : "text-orange-200/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>📷</span>
              <span>กล้องถ่ายทอดสด</span>
            </button>
            <button
              onClick={() => setActiveMode("upload")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeMode === "upload"
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-600/40 scale-100"
                  : "text-orange-200/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>🖼️</span>
              <span>อัปโหลดรูปภาพ</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 container max-w-4xl mx-auto px-4 pb-16">
        {modelLoading && (
          <div className="mb-6 p-4 rounded-2xl bg-orange-950/60 border border-orange-500/30 flex items-center justify-center gap-3 text-orange-200 text-sm">
            <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
            <span>กำลังโหลดโมเดลปัญญาประดิษฐ์ (AI Model)...</span>
          </div>
        )}

        {/* Camera Mode */}
        {activeMode === "camera" && (
          <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-orange-500/30 bg-neutral-950 aspect-[4/3] max-w-2xl mx-auto">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Overlay Frame */}
              <div className="absolute inset-4 pointer-events-none border border-dashed border-orange-400/50 rounded-2xl flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <div className="w-5 h-5 border-t-2 border-l-2 border-orange-400" />
                  <div className="w-5 h-5 border-t-2 border-r-2 border-orange-400" />
                </div>
                <div className="flex justify-center">
                  <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-orange-300 border border-orange-500/30">
                    {webcamLoading ? "⚡ กำลังประมวลผล..." : "🎯 เล็งกล้องไปที่อาหาร"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-5 h-5 border-b-2 border-l-2 border-orange-400" />
                  <div className="w-5 h-5 border-b-2 border-r-2 border-orange-400" />
                </div>
              </div>
            </div>

            {/* Webcam Prediction Result Card */}
            <div className="max-w-2xl mx-auto rounded-3xl bg-gradient-to-br from-white via-orange-50 to-amber-50 text-neutral-900 p-6 sm:p-8 shadow-2xl border border-orange-200">
              <div className="flex items-center justify-between border-b border-orange-200/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <h3 className="font-extrabold text-lg text-red-900">
                    ผลการตรวจจับจากกล้อง
                  </h3>
                </div>
                {webcamConfidence && (
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold shadow-sm">
                    ความมั่นใจ {(webcamConfidence * 100).toFixed(1)}%
                  </span>
                )}
              </div>

              {webcamLoading ? (
                <div className="flex items-center justify-center py-8 gap-3 text-orange-700">
                  <div className="w-6 h-6 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span className="font-semibold">AI กำลังวิเคราะห์เมนูอาหาร...</span>
                </div>
              ) : webcamResult ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <h4 className="text-2xl sm:text-3xl font-black text-red-700">
                      {webcamResult}
                    </h4>
                  </div>

                  {/* Confidence Progress Bar */}
                  {webcamConfidence && (
                    <div className="w-full bg-orange-100 rounded-full h-3 overflow-hidden border border-orange-200">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-red-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(5, webcamConfidence * 100))}%` }}
                      />
                    </div>
                  )}

                  {foodInfo[webcamResult] ? (
                    <div className="p-4 rounded-2xl bg-orange-100/70 border border-orange-200 text-neutral-800 text-sm sm:text-base leading-relaxed font-medium">
                      💡 {foodInfo[webcamResult]}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-600">
                      ตรวจพบเมนู {webcamResult} แล้ว กำลังรวบรวมข้อมูลโภชนาการเพิ่มเติม
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500">
                  <span className="text-4xl block mb-2 opacity-60">🍽️</span>
                  <p className="font-medium text-sm sm:text-base">
                    ยังไม่มีการตรวจจับอาหาร กรุณาขยับกล้องส่องไปที่จานอาหาร
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload Mode */}
        {activeMode === "upload" && (
          <div className="space-y-6">
            <div className="max-w-2xl mx-auto bg-neutral-950/70 rounded-3xl p-6 border-2 border-dashed border-orange-500/40 text-center backdrop-blur-md">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />

              {previewImage ? (
                <div className="space-y-4">
                  <div className="relative aspect-video max-w-lg mx-auto rounded-2xl overflow-hidden border-2 border-orange-400 shadow-xl">
                    <img
                      src={previewImage}
                      alt="Uploaded food"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold px-6 py-3 rounded-2xl shadow-lg hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    <span>🔄</span>
                    <span>เลือกรูปภาพอื่น</span>
                  </button>
                </div>
              ) : (
                <div className="py-8 space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-orange-500/20 to-red-500/20 border border-orange-400/40 flex items-center justify-center text-4xl shadow-inner">
                    📤
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      เลือกรูปภาพอาหารที่คุณต้องการตรวจสอบ
                    </h3>
                    <p className="text-xs sm:text-sm text-orange-200/60 mt-1">
                      รองรับไฟล์ภาพ JPG, PNG, WEBP จากมือถือหรือคอมพิวเตอร์
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 via-amber-500 to-red-600 text-white font-black px-8 py-3.5 rounded-2xl shadow-xl hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transition-all duration-200 text-base"
                  >
                    <span>📁</span>
                    <span>เลือกไฟล์ภาพอาหาร</span>
                  </button>
                </div>
              )}
            </div>

            {/* Upload Prediction Result Card */}
            <div className="max-w-2xl mx-auto rounded-3xl bg-gradient-to-br from-white via-orange-50 to-amber-50 text-neutral-900 p-6 sm:p-8 shadow-2xl border border-orange-200">
              <div className="flex items-center justify-between border-b border-orange-200/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  <h3 className="font-extrabold text-lg text-red-900">
                    ผลการวิเคราะห์จากรูปถ่าย
                  </h3>
                </div>
                {uploadConfidence && (
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold shadow-sm">
                    ความมั่นใจ {(uploadConfidence * 100).toFixed(1)}%
                  </span>
                )}
              </div>

              {uploadLoading ? (
                <div className="flex items-center justify-center py-8 gap-3 text-orange-700">
                  <div className="w-6 h-6 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span className="font-semibold">AI กำลังวิเคราะห์รูปภาพของคุณ...</span>
                </div>
              ) : uploadResult ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <h4 className="text-2xl sm:text-3xl font-black text-red-700">
                      {uploadResult}
                    </h4>
                  </div>

                  {uploadConfidence && (
                    <div className="w-full bg-orange-100 rounded-full h-3 overflow-hidden border border-orange-200">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-red-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(5, uploadConfidence * 100))}%` }}
                      />
                    </div>
                  )}

                  {foodInfo[uploadResult] ? (
                    <div className="p-4 rounded-2xl bg-orange-100/70 border border-orange-200 text-neutral-800 text-sm sm:text-base leading-relaxed font-medium">
                      💡 {foodInfo[uploadResult]}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-600">
                      ผลการวิเคราะห์: {uploadResult}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500">
                  <span className="text-4xl block mb-2 opacity-60">📷</span>
                  <p className="font-medium text-sm sm:text-base">
                    ยังไม่มีการอัปโหลดภาพ กรุณากดปุ่มด้านบนเพื่อเลือกภาพ
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Home;
