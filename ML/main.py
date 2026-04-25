from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
import random
import io
import os
import json
import pickle
from datetime import datetime

from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

app = FastAPI(title="Student Retention ML Service", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-memory model store ---
MODEL_PATH = "model.pkl"
MODEL_META_PATH = "model_meta.json"

model_store = {
    "model": None,
    "trained_at": None,
    "accuracy": None,
    "precision": None,
    "recall": None,
    "f1": None,
    "training_samples": None,
    "feature_importance": None,
    "confusion_matrix": None,
    "model_type": None,
}

# --- Pydantic Models ---
class StudentData(BaseModel):
    gpa: float
    attendance: float
    credits_earned: Optional[int] = 120
    extracurricular_score: Optional[float] = 50.0
    previous_semester_gpa: Optional[float] = 0.0

class BulkStudentData(BaseModel):
    students: List[StudentData]
    student_ids: Optional[List[str]] = None

class CareerInput(BaseModel):
    skills: List[str]
    interests: List[str]

class TrainRequest(BaseModel):
    model_type: Optional[str] = "random_forest"  # "random_forest" or "gradient_boosting"
    n_samples: Optional[int] = 1000

# --- Helpers ---
def generate_synthetic_dataset(n_samples: int = 1000):
    """Generate realistic synthetic student data for training."""
    np.random.seed(42)
    gpa = np.clip(np.random.normal(2.8, 0.7, n_samples), 0, 4.0)
    attendance = np.clip(np.random.normal(78, 15, n_samples), 0, 100)
    credits_earned = np.random.randint(60, 130, n_samples)
    extracurricular_score = np.clip(np.random.normal(50, 20, n_samples), 0, 100)
    prev_gpa = np.clip(gpa + np.random.normal(0, 0.3, n_samples), 0, 4.0)

    # Risk label derived from realistic rules
    risk_score = (
        (4.0 - gpa) * 20 +
        (100 - attendance) * 0.5 +
        (130 - credits_earned) * 0.2 +
        (100 - extracurricular_score) * 0.1 +
        (4.0 - prev_gpa) * 10
    )
    risk_score = np.clip(risk_score + np.random.normal(0, 5, n_samples), 0, 100)

    labels = np.where(risk_score > 65, 'High', np.where(risk_score > 35, 'Medium', 'Low'))

    df = pd.DataFrame({
        'gpa': gpa,
        'attendance': attendance,
        'credits_earned': credits_earned,
        'extracurricular_score': extracurricular_score,
        'previous_semester_gpa': prev_gpa,
        'risk_label': labels
    })
    return df

def train_model_from_df(df: pd.DataFrame, model_type: str = "random_forest"):
    """Train a model from a cleaned dataframe."""
    features = ['gpa', 'attendance', 'credits_earned', 'extracurricular_score', 'previous_semester_gpa']
    
    # Ensure all feature columns exist
    for col in features:
        if col not in df.columns:
            df[col] = 0

    X = df[features].fillna(0)
    y = df['risk_label']

    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded)

    if model_type == "gradient_boosting":
        clf = GradientBoostingClassifier(n_estimators=100, max_depth=4, random_state=42)
    else:
        clf = RandomForestClassifier(n_estimators=150, max_depth=8, min_samples_split=5, random_state=42)

    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)
    cm = confusion_matrix(y_test, y_pred).tolist()
    importance = dict(zip(features, [round(float(v), 4) for v in clf.feature_importances_]))

    # Persist model
    with open(MODEL_PATH, "wb") as f:
        pickle.dump({"model": clf, "label_encoder": le}, f)

    meta = {
        "trained_at": datetime.utcnow().isoformat(),
        "accuracy": round(acc * 100, 2),
        "precision": round(report.get("macro avg", {}).get("precision", 0) * 100, 2),
        "recall": round(report.get("macro avg", {}).get("recall", 0) * 100, 2),
        "f1": round(report.get("macro avg", {}).get("f1-score", 0) * 100, 2),
        "training_samples": len(X_train),
        "feature_importance": importance,
        "confusion_matrix": cm,
        "model_type": model_type,
        "classes": list(le.classes_),
    }
    with open(MODEL_META_PATH, "w") as f:
        json.dump(meta, f)

    model_store.update(model=clf, **{k: meta[k] for k in meta if k != 'classes'})
    model_store["label_encoder"] = le
    model_store["classes"] = meta["classes"]

    return meta

def load_model_if_exists():
    """Load persisted model on startup."""
    if os.path.exists(MODEL_PATH) and os.path.exists(MODEL_META_PATH):
        with open(MODEL_PATH, "rb") as f:
            data = pickle.load(f)
            model_store["model"] = data["model"]
            model_store["label_encoder"] = data["label_encoder"]
        with open(MODEL_META_PATH, "r") as f:
            meta = json.load(f)
            for k, v in meta.items():
                model_store[k] = v

def predict_single(student: StudentData):
    """Run inference on a single student."""
    if model_store["model"] is None:
        # Fallback rule-based
        risk_score = 100 - (student.gpa * 15 + student.attendance * 0.5)
        risk_score = max(0, min(100, risk_score))
        category = "High" if risk_score > 70 else ("Medium" if risk_score > 35 else "Low")
        return {"risk_score": round(risk_score, 2), "category": category, "model_used": "rule_based"}

    clf = model_store["model"]
    le = model_store["label_encoder"]
    X = pd.DataFrame([{
        "gpa": student.gpa,
        "attendance": student.attendance,
        "credits_earned": student.credits_earned or 120,
        "extracurricular_score": student.extracurricular_score or 50,
        "previous_semester_gpa": student.previous_semester_gpa or student.gpa,
    }])
    pred = clf.predict(X)[0]
    proba = clf.predict_proba(X)[0]
    category = le.inverse_transform([pred])[0]
    risk_score = round(float(proba.max() * 100), 2)

    # Normalize score to be risk-oriented (High = high score)
    if category == "Low":
        risk_score = round(proba[list(le.classes_).index("Low") if "Low" in le.classes_ else 0] * 40, 2)
    elif category == "Medium":
        risk_score = round(40 + proba[list(le.classes_).index("Medium") if "Medium" in le.classes_ else 1] * 30, 2)
    else:
        risk_score = round(70 + proba[list(le.classes_).index("High") if "High" in le.classes_ else 2] * 30, 2)

    return {"risk_score": round(risk_score, 2), "category": category, "model_used": model_store.get("model_type", "random_forest")}

# --- Startup ---
@app.on_event("startup")
def startup_event():
    load_model_if_exists()

# --- Routes ---
@app.get("/")
def read_root():
    return {"message": "Student Retention ML API v2.0 is online", "model_ready": model_store["model"] is not None}

@app.get("/ml/status")
def get_status():
    """Get current model status and metadata."""
    is_trained = model_store["model"] is not None
    return {
        "model_ready": is_trained,
        "trained_at": model_store.get("trained_at"),
        "accuracy": model_store.get("accuracy"),
        "precision": model_store.get("precision"),
        "recall": model_store.get("recall"),
        "f1": model_store.get("f1"),
        "training_samples": model_store.get("training_samples"),
        "feature_importance": model_store.get("feature_importance"),
        "confusion_matrix": model_store.get("confusion_matrix"),
        "model_type": model_store.get("model_type"),
    }

@app.post("/ml/train")
def train_with_synthetic(req: TrainRequest):
    """Train the model on a synthetic dataset."""
    df = generate_synthetic_dataset(req.n_samples or 1000)
    meta = train_model_from_df(df, req.model_type or "random_forest")
    return {"success": True, "message": "Model trained successfully on synthetic data", "meta": meta}

@app.post("/ml/train-csv")
async def train_from_csv(file: UploadFile = File(...), model_type: str = "random_forest"):
    """Train the model from an uploaded CSV file."""
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    contents = await file.read()
    try:
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(e)}")

    required = {'gpa', 'attendance', 'risk_label'}
    if not required.issubset(set(df.columns)):
        raise HTTPException(
            status_code=400,
            detail=f"CSV must contain columns: {required}. Found: {list(df.columns)}"
        )

    df = df.dropna(subset=['gpa', 'attendance', 'risk_label'])
    df['risk_label'] = df['risk_label'].str.capitalize()
    df = df[df['risk_label'].isin(['Low', 'Medium', 'High'])]

    if len(df) < 20:
        raise HTTPException(status_code=400, detail="Dataset too small. Need at least 20 valid rows.")

    meta = train_model_from_df(df, model_type)
    return {"success": True, "message": f"Model trained on {len(df)} rows from CSV.", "meta": meta}

@app.post("/ml/predict-risk")
def predict_risk(data: StudentData):
    """Predict risk for a single student."""
    result = predict_single(data)
    return result

@app.post("/ml/predict-bulk")
def predict_bulk(data: BulkStudentData):
    """Predict risk for multiple students."""
    results = []
    for i, student in enumerate(data.students):
        result = predict_single(student)
        if data.student_ids and i < len(data.student_ids):
            result["student_id"] = data.student_ids[i]
        results.append(result)
    return {"predictions": results, "count": len(results)}

@app.post("/ml/recommend-career")
def recommend_career(input_data: CareerInput):
    """Recommend careers based on skills and interests."""
    all_careers = [
        {"title": "Full-Stack Developer", "required_skills": ["React", "Node.js", "MongoDB", "JavaScript"]},
        {"title": "Data Scientist", "required_skills": ["Python", "Statistics", "SQL", "Machine Learning"]},
        {"title": "Cloud Engineer", "required_skills": ["AWS", "Docker", "Kubernetes", "Linux"]},
        {"title": "Cybersecurity Analyst", "required_skills": ["Networking", "Security+", "Linux", "Ethical Hacking"]},
        {"title": "Mobile Developer", "required_skills": ["Flutter", "React Native", "iOS", "Android"]},
        {"title": "DevOps Engineer", "required_skills": ["CI/CD", "Docker", "Terraform", "Linux"]},
        {"title": "UI/UX Designer", "required_skills": ["Figma", "Adobe XD", "User Research", "Prototyping"]},
        {"title": "AI/ML Engineer", "required_skills": ["Python", "TensorFlow", "PyTorch", "Mathematics"]},
    ]

    recommendations = []
    for career in all_careers:
        user_skills_lower = [s.lower() for s in (input_data.skills + input_data.interests)]
        req_lower = [s.lower() for s in career["required_skills"]]
        match_count = sum(1 for skill in req_lower if any(skill in u or u in skill for u in user_skills_lower))
        match_pct = (match_count / len(career["required_skills"])) * 100 if career["required_skills"] else 0
        match_pct = min(100, match_pct + random.randint(5, 25))
        recommendations.append({"title": career["title"], "match_percentage": round(match_pct, 2)})

    recommendations.sort(key=lambda x: x["match_percentage"], reverse=True)
    return recommendations[:4]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
