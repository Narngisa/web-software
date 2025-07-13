
# 🐳 Docker Command Cheatsheet สำหรับโปรเจกต์ Web-Software

ไฟล์นี้รวบรวมคำสั่ง Docker ที่จำเป็นในการพัฒนาและจัดการโปรเจกต์ `web-software` ซึ่งประกอบด้วย:
- frontend (Vite + React)
- backend (Node.js + Express + MongoDB)
- MongoDB (ฐานข้อมูล)

---

## 📦 การใช้งานเบื้องต้น

### ✨ สร้างและรัน Container

```bash
docker compose up -d        # เริ่มระบบทั้งหมดแบบเบื้องหลัง
docker compose build        # สร้าง image ใหม่ (ใช้เมื่อแก้ Dockerfile)
```

### 🛑 หยุดและล้างระบบ

```bash
docker compose down         # หยุดและลบ container + network
```

---

## 🔧 คำสั่งเกี่ยวกับ Container

| คำสั่ง | อธิบาย |
|--------|--------|
| `docker ps` | ดู container ที่กำลังทำงานอยู่ |
| `docker ps -a` | ดู container ทั้งหมด (รวมที่หยุดแล้ว) |
| `docker stop <ชื่อหรือ ID>` | หยุด container |
| `docker start <ชื่อหรือ ID>` | เริ่ม container ที่หยุดไว้ |
| `docker restart <ชื่อหรือ ID>` | รีสตาร์ท container |
| `docker rm <ชื่อหรือ ID>` | ลบ container |

---

## 🧠 เข้าใช้งานภายใน Container

```bash
docker exec -it <ชื่อ-container> bash        # เข้า shell ภายใน container
docker exec -it <mongo-container> mongosh     # เข้า MongoDB shell
```

---

## 📄 เช็ค Log Container

```bash
docker logs <ชื่อ-container>
docker compose logs
docker compose logs -f       # real-time log
```

---

## 🌐 คำสั่งเกี่ยวกับ Network

```bash
docker network ls                       # แสดง network ทั้งหมด
docker network inspect <ชื่อ-network>   # ดูรายละเอียด
docker network rm <ชื่อ-network>        # ลบ network
```

---

## 💾 คำสั่งเกี่ยวกับ Volume

```bash
docker volume ls                        # แสดง volumes ทั้งหมด
docker volume inspect <ชื่อ-volume>     # รายละเอียด
docker volume rm <ชื่อ-volume>          # ลบ (หากไม่ได้ใช้งานอยู่)
```

---

## 🗃️ คำสั่งเกี่ยวกับ Image

```bash
docker images
docker rmi <image-id>
docker build -t <ชื่อ-image> .
```

---

## 🍃 MongoDB เบื้องต้นใน Container

```bash
# เข้า shell
docker exec -it web-software-mongo-1 mongosh

# คำสั่งภายใน Mongo shell
show dbs
use <ชื่อ-database>
show collections
db.<ชื่อ-collection>.find().pretty()
```

---

## 🧹 ล้าง Docker (ระวังการใช้งาน)

```bash
docker system prune -a        # ลบทุกอย่างที่ไม่ได้ใช้งาน
docker volume prune
docker image prune -a
```

---

## ✅ ตรวจสอบสถานะ

```bash
docker ps              # ตรวจสอบว่าทุก service ทำงานหรือไม่
docker compose ps
```

---

## 📍 หมายเหตุ

- พอร์ตที่เชื่อมโยง:
  - Frontend: `localhost:5173`
  - Backend: `localhost:8080`
  - MongoDB: `localhost:27017` *(ควรใช้ mongosh เข้าแทนการเปิดผ่านเบราว์เซอร์)*

---
