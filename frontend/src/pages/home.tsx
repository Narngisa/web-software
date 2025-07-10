import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import { foodInfo } from '../data/foodInfo';

function Home() {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [labels, setLabels] = useState<string[]>([]);

  // กล้อง
  const [webcamResult, setWebcamResult] = useState<string | null>(null);
  const [webcamConfidence, setWebcamConfidence] = useState<number | null>(null);
  const [webcamLoading, setWebcamLoading] = useState<boolean>(false);

  // อัปโหลดภาพ
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [uploadConfidence, setUploadConfidence] = useState<number | null>(null);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel('/model/model.json');
        const metadata = await fetch('/model/metadata.json').then(res => res.json());
        setModel(loadedModel);
        setLabels(metadata.labels || []);
        console.log('✅ โหลดโมเดลสำเร็จ');
      } catch (e) {
        console.error('❌ โหลดโมเดลไม่สำเร็จ:', e);
      }
    };
    loadModel();
  }, []);

  const classifyImage = async (
    image: tf.Tensor3D,
    isFromWebcam = false
  ) => {
    if (!model || labels.length === 0) return;

    if (isFromWebcam) setWebcamLoading(true);
    else setUploadLoading(true);

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
      console.error('❌ พยากรณ์ล้มเหลว:', err);
    } finally {
      if (isFromWebcam) setWebcamLoading(false);
      else setUploadLoading(false);
    }
  };

  useEffect(() => {
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
    }, 1000);

    return () => clearInterval(interval);
  }, [model, labels, webcamLoading]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  return (
    <div className="bg-[#ff7b00] min-h-screen text-center text-white">
      <nav className="flex justify-between items-center p-8 bg-[#991b1b]">
        <div>
          <span className="text-4xl font-bold">Eat </span>
          <span className="text-2xl font-bold">แหลก</span>
        </div>
        <ul className="flex space-x-4 font-semibold">
          <a href="#">ลงชื่อเข้าใช้งาน</a>
        </ul>
      </nav>

      {/* กล้อง */}
      <div className="py-6">
        <h2 className="text-2xl font-bold mb-4">📷 ตรวจจับจากกล้อง</h2>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          width={400}
          height={300}
          className="rounded-md shadow-md mx-auto"
        />

        <div className="bg-white text-black p-4 rounded-md mx-auto mt-4 w-80 shadow-lg min-h-[120px]">
          {webcamLoading ? (
            <p className="text-gray-500">กำลังประมวลผล...</p>
          ) : webcamResult ? (
            <>
              <p className="text-2xl text-green-700 font-semibold">
                {webcamResult} ({(webcamConfidence! * 100).toFixed(1)}%)
              </p>
              {foodInfo[webcamResult] && (
                <p className="mt-3 text-sm text-gray-700">{foodInfo[webcamResult]}</p>
              )}
            </>
          ) : (
            <p className="text-gray-500">ยังไม่มีการตรวจจับ</p>
          )}
        </div>
      </div>

      {/* อัปโหลด */}
      <div className="py-6">
        <h2 className="text-2xl font-bold mb-4">🖼 ตรวจจับจากภาพอัปโหลด</h2>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />
        <button
          className="bg-white text-black font-semibold px-4 py-2 rounded shadow hover:bg-gray-200"
          onClick={() => fileInputRef.current?.click()}
        >
          📤 อัปโหลดภาพอาหาร
        </button>

        <div className="bg-white text-black p-4 rounded-md mx-auto mt-4 w-80 shadow-lg min-h-[120px]">
          {uploadLoading ? (
            <p className="text-gray-500">กำลังประมวลผล...</p>
          ) : uploadResult ? (
            <>
              <p className="text-2xl text-green-700 font-semibold">
                {uploadResult} ({(uploadConfidence! * 100).toFixed(1)}%)
              </p>
              {foodInfo[uploadResult] && (
                <p className="mt-3 text-sm text-gray-700">{foodInfo[uploadResult]}</p>
              )}
            </>
          ) : (
            <p className="text-gray-500">ยังไม่มีการตรวจจับ</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
