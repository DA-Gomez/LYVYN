# LYVYN

## Project Description

LYVYN is a virtual wardrobe and outfit recommendation app. You add your clothing items (category, warmth, formality, color group), and LYVYN suggests an outfit based on the live weather in your city and the occasion (casual or formal). Every outfit can be liked or disliked, and that feedback is used to retrain a small machine-learning model so recommendations improve over time.

**Tech stack:** React + Vite (frontend), Express + Firebase Firestore (backend), Python + scikit-learn (ML model).

## Prerequisites

- Git
- Node.js (with npm)
- Python 3

You also need two secret files that are NOT in the repository:

1. `backend/config/serviceAccountKey.json`: the Firebase service account key.
2. `.env` in the project root fill OPENWEATHER_API_KEY with your OpenWeather API key.

## How to run

Clone the repository and open a terminal in the project folder:

```
git clone https://github.com/DA-Gomez/LYVYN.git
cd LYVYN
```

### 1. Set up the backend

```
cd backend
npm install
```

Set up the Python environment for the ML model (still inside `/backend`):

```
python -m venv venv
venv\Scripts\activate
pip install -r ml/requirements.txt
```

*If `python` doesn't work, try `py` or `python3`.*

### 2. Start the backend

From `/backend`, with the venv activated (so the ML script can find its packages):

```
npm start
```

The API runs on http://localhost:3000

### 3. Start the frontend

In a second terminal:

```
cd frontend
npm install
npm run dev
```

## Push changes

If you've got local changes you want to put on the repository, do

``$ git add .``

``$ git commit -m "your message"``

``$ git push``

Work on your own branch and open a pull request instead of pushing straight to master.
