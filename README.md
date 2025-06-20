
# 🧠 Focus Guardian

**Real-time AI-powered productivity assistant that monitors distraction, focus patterns, and gives personalized insights — just like a virtual focus coach.**

---

## 🚀 Features

### 🎯 Real-Time Focus Monitoring

* Continuously analyzes webcam input (blink rate, gaze, hand gestures)
* Tracks app usage patterns and attention trends
* Calculates a live **focus score** and distraction **confidence**

### 📊 Beautiful Vercel-Style Dashboard

* Sticky top bar showing session status, focus level, and current time
* Fixed bottom bar with **Quick Actions**: Take Break, Start Pomodoro, Block Distractions
* Charts for focus trend by hour
* Panels for:

  * Eye tracking metrics
  * Biometric data (heart rate, posture, stress — simulated or from wearables)
  * App usage over time
  * Insights & personalized tips

### 🤖 Smart ML-Driven Predictions

* Combines:

  * Blink rate
  * Gaze direction
  * App usage
  * Hand gestures
  * Session trends
* Uses a rolling 30–60s time window for accuracy (avoids false positives)
* Detects when you're *at risk of distraction* before it happens

### 🗂️ Fullstack Architecture

* **Frontend**: React + Tailwind (or Shadcn UI)
* **Backend**: FastAPI + Python ML modules
* **Database**: SQLite (or PostgreSQL-ready)

---

## 📦 Project Structure

```bash
focus-guardian/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── ml_model.py          # Focus prediction logic
│   ├── webcam_utils.py      # OpenCV + MediaPipe for face, eye, hand
│   ├── database.py          # SQLAlchemy or raw DB layer
│   └── requirements.txt     # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx          # Main app
│   │   ├── components/      # Dashboard UI components
│   │   ├── pages/           # Views: Home, Insights, App Usage
│   │   ├── api/             # Axios calls to backend
│   └── package.json         # Frontend dependencies
│
└── README.md
```

---

## 🧪 Local Development

### 🔧 Backend (Python + FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 💻 Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🧠 How It Works

* Webcam is accessed using OpenCV
* MediaPipe tracks:

  * Face and eyes → blink rate, gaze
  * Hands → fidgeting or distraction
* App usage simulated (or tracked with local agent)
* Rolling data buffer (e.g. 30–60s) feeds into model
* Model returns:

  * `focus_status`: focused / at risk / distracted
  * `confidence_score`: 0.0–1.0
  * `focus_score`: daily score, tracked over time
* Session data logged in the database for insights and trends

---

## 📈 Sample Insight Output

> **Focus Status**: At Risk
> **Confidence**: 78%
> **Blink Rate**: 30/min
> **High switching frequency**, **gaze drift**, **low mood rating**
> 💡 *You’re most productive between 9–11 AM. Try deep work during this window.*

---

## 🧰 Future Features (Planned)

* [ ] OAuth login and cloud storage
* [ ] Real app usage tracker (cross-platform)
* [ ] Wearable integration (Fitbit, Apple Watch, Oura)
* [ ] WebSocket-based live updates
* [ ] Voice alerts when drift detected

---

## 🛡️ Privacy & Ethics

Focus Guardian is built to be privacy-conscious:

* All webcam data is processed locally
* No image or biometric data is uploaded or stored unless explicitly configured
* You control what is tracked and when

---

## 📄 License

MIT License.
Built with ❤️ by \Assem — for focus, not surveillance.

---

Would you like a **badge version** (with shields.io), or a **live deployed demo README** if you plan to launch on Vercel or Render?
