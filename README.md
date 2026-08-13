# 🥗 NutriTrack / Food AI & Health Tracker

เว็บแอปพลิเคชันวิเคราะห์และตรวจจับภาพอาหารด้วยโมเดล AI (TensorFlow.js) พร้อมระบบคำนวณดัชนีมวลกาย (BMI), อัตราการเผาผลาญพลังงาน (BMR/TDEE) และวางแผนโภชนาการส่วนบุคคล

---

## 🌟 ฟีเจอร์หลัก (Features)

1. **AI Food Classification (การจำแนกภาพอาหารด้วย AI)**
   - สแกนภาพอาหารแบบ Real-time ผ่านเว็บแคม (Webcam) หรืออัปโหลดรูปภาพจากอุปกรณ์
   - ใช้โมเดล Machine Learning ในเบราว์เซอร์ผ่าน TensorFlow.js
   - แสดงผลความน่าจะเป็น (Confidence Score) และข้อมูลแคลอรี่/คุณค่าทางโภชนาการของอาหารแต่ละประเภท

2. **BMI & BMR Calculator (คำนวณดัชนีมวลกายและการเผาผลาญพื้นฐาน)**
   - คำนวณค่า BMI เพื่อประเมินเกณฑ์รูปร่าง (ผอม, สมส่วน, น้ำหนักเกิน, โรคอ้วน)
   - คำนวณค่า BMR (Basal Metabolic Rate) แสดงพลังงานขั้นต่ำที่ร่างกายต้องการในแต่ละวัน
   - มีคำแนะนำด้านสุขภาพเฉพาะบุคคลตามระดับผลลัพธ์

3. **Nutrition & Health Goals Planner (วางแผนแคลอรี่และสารอาหารตามเป้าหมาย)**
   - เลือกเป้าหมายสุขภาพ: **ลดไขมัน (Lose Weight)**, **เพิ่มกล้ามเนื้อ (Gain Muscle)** หรือ **คงรูปร่าง (Maintain)**
   - คำนวณค่า TDEE (Total Daily Energy Expenditure) ตามระดับกิจกรรมประจำวัน
   - สรุปเป้าหมายพลังงานต่อวัน (Target Calories) พร้อมการกระจายสัดส่วนสารอาหารหลัก (Macronutrients: โปรตีน, คาร์โบไฮเดรต, ไขมัน)

---

## 🛠️ สแต็กเทคโนโลยี (Tech Stack)

### Frontend (`/client`)
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS v4
- **AI / Machine Learning:** `@tensorflow/tfjs`
- **Camera:** `react-webcam`
- **Routing:** `react-router-dom`
- **Alert / UI Notification:** `sweetalert2`

### Backend (`/server`)
- **Runtime:** Node.js
- **Framework:** Express.js (รองรับการ Serve static build ของ Vite และจัดการ SPA client-side routing)
- **Dev Tool:** Nodemon

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
web-software/
├── client/                     # โค้ดส่วน Frontend (React + TypeScript + Vite)
│   ├── public/                 # Static assets และโฟลเดอร์โมเดล AI (/model)
│   ├── src/
│   │   ├── components/         # คอมโพเนนต์ UI ส่วนกลาง (Navbar, Footer ฯลฯ)
│   │   ├── data/               # ฐานข้อมูลเมนูอาหารและแคลอรี่ (foodInfo.ts)
│   │   ├── pages/              # หน้าเว็บหลัก (Home, BMI, GoalsPage)
│   │   ├── routes/             # การจัดการ Routing (Router.tsx)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
├── server/                     # โค้ดส่วน Backend Server (Express.js)
│   ├── index.js                # Entry point สำหรับรัน Express server
│   └── package.json
└── README.md
```

---

## 🚀 วิธีการติดตั้งและรันโปรเจกต์ (Getting Started)

### ความต้องการของระบบ (Prerequisites)
- Node.js (เวอร์ชัน 18.x หรือใหม่กว่า)
- npm หรือ yarn

---

### 1. ติดตั้ง Dependencies

#### ติดตั้งส่วน Frontend (Client)
```bash
cd client
npm install
```

#### ติดตั้งส่วน Backend (Server)
```bash
cd ../server
npm install
```

---

### 2. การรันโปรเจกต์ในโหมดพัฒนา (Development Mode)

#### รัน Frontend (Vite Dev Server)
```bash
cd client
npm run dev
```
> เข้าใช้งานได้ที่: `http://localhost:5173`

#### รัน Backend Server (Optional)
```bash
cd server
npm run dev
```
> Backend API / Server จะรันอยู่ที่: `http://localhost:8080`

---

### 3. การ Build และรันในโหมด Production

1. สร้าง Production Build ของ Frontend:
   ```bash
   cd client
   npm run build
   ```
2. สตาร์ท Express Server เพื่อ Serve Frontend ที่ Build เสร็จแล้ว:
   ```bash
   cd ../server
   node index.js
   ```
3. เปิดเบราว์เซอร์ไปที่: `http://localhost:8080`

---

## 📄 License
This project is licensed under the [MIT License](file:///C:/Users/Narngisa/Desktop/web-software/LICENSE).
