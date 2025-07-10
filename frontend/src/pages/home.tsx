import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';

function Home() {
  const webcamRef = useRef<Webcam>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // โหลดโมเดล Teachable Machine และ metadata
  useEffect(() => {
    const loadModel = async () => {
      try {
        // โหลด LayersModel แทน GraphModel
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

  // ฟังก์ชันทำนายภาพจาก webcam
  const predict = async () => {
    if (
      loading || // ป้องกันเรียกซ้อน
      !webcamRef.current?.video ||
      webcamRef.current.video.readyState !== 4 ||
      !model ||
      labels.length === 0
    ) return;

    setLoading(true);

    try {
      const video = webcamRef.current.video;
      const imgTensor = tf.browser.fromPixels(video);
      const resized = tf.image.resizeBilinear(imgTensor, [224, 224]);
      const normalized = resized.div(255).expandDims(0);

      const prediction = model.predict(normalized) as tf.Tensor;
      const data = await prediction.data();

      const highestIndex = data.indexOf(Math.max(...data));
      setResult(labels[highestIndex]);
      setConfidence(data[highestIndex]);

      tf.dispose([imgTensor, resized, normalized, prediction]);
    } catch (error) {
      console.error('❌ เกิดข้อผิดพลาดระหว่างการพยากรณ์:', error);
    } finally {
      setLoading(false);
    }
  };

  // เรียก predict ทุก 1 วินาทีอัตโนมัติ
  useEffect(() => {
    const interval = setInterval(() => {
      predict();
    }, 1000);

    return () => clearInterval(interval);
  }, [model, labels, loading]);

  const foodInfo: { [key: string]: string } = {
    'ข้าวปั้น': 'ข้าวปั้น (Sushi) ให้พลังงานประมาณ 200 kcal ต่อชุด',
    'ข้าวผัด': 'ข้าวผัดจานด่วน (~450 kcal)',
    'ข้าวมันไก่ทอด': 'ข้าวมันไก่ทอด (~600 kcal) มีไขมันปานกลางถึงสูง',
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

      <div className="flex justify-center items-center py-8">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          width={400}
          height={300}
          className="rounded-md shadow-md"
        />
      </div>

      <div className="bg-white text-black p-4 rounded-md mx-auto mt-6 w-80 shadow-lg min-h-[120px]">
        <h2 className="text-xl font-bold">🍽 วัตถุที่ตรวจพบ:</h2>

        {loading ? (
          <p className="text-gray-500 mt-2">กำลังประมวลผล...</p>
        ) : result ? (
          <>
            <p className="text-2xl text-green-700 font-semibold mt-2">
              {result} ({(confidence! * 100).toFixed(1)}%)
            </p>
            {foodInfo[result] && (
              <p className="mt-3 text-sm text-gray-700">{foodInfo[result]}</p>
            )}
          </>
        ) : (
          <p className="text-lg text-gray-500 mt-2">ยังไม่มีการตรวจจับ</p>
        )}
      </div>
    </div>
  );
}

export default Home;
