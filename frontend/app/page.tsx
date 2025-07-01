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
    <div className="flex flex-col items-center p-6 space-y-4">
      <video
        ref={videoRef}
        className="w-80 h-auto rounded-md border border-gray-300"
        autoPlay
        muted
        playsInline
      />
      <button
        onClick={capturePhoto}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        ถ่ายรูป
      </button>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
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
  );
}