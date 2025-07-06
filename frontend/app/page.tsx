"use client";

import React, { useRef, useState, useEffect } from "react";

export default function CameraCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captured, setCaptured] = useState<string | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
    setupCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");
    setCaptured(dataUrl);
  };

  return (
    <div className='text-[#124a28]'>
      <div>
        <nav>
          <div className='flex justify-between items-center bg-[#a1ffec] px-8 py-4'>
            <h1 className='text-2xl font-semibold px-5'>Test</h1>
            <ul className='flex space-x-4'>
              <a href="">Home</a>
              <a href="">Calorie</a>
              <a href="">Exercise</a>
              <a href="">Sign Up</a>
            </ul>
          </div>
        </nav>
      </div>

      <div>
        <h1 className='text-3xl text-center mt-10'>กล้องถ่ายรูป</h1>
        <p className='text-center mt-2'>กรุณาอนุญาตให้เข้าถึงกล้องเพื่อถ่ายรูป</p>
      </div>
      <div className="flex flex-col items-center p-3 space-y-1">
        <video
          ref={videoRef}
          className="p-16 w-80 h-auto rounded-md border border-gray-300"
          autoPlay
          muted
          playsInline
        />
        <button
          onClick={capturePhoto}
          className="px-4 py-2 bg-[#a1ffec] rounded hover:bg-[#3ab59c] transition flex flex-col space-y-4 mt-4"
        >       
          ถ่ายรูป
        </button>
        <button
          className="px-4 py-2 bg-[#a1ffec] rounded hover:bg-[#3ab59c] transition"
        >
          อัพโหลด
        </button>

        {captured && (
          <div className="mt-4">
            <p className="mb-2 font-semibold">รูปที่ถ่าย:</p>
            <img src={captured} alt="Captured" className="w-80 rounded-md border" />
          </div>
        )}

        {/* ซ่อน canvas */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}