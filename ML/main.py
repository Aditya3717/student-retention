from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import random

app = FastAPI(title="Student Retention ML Service")

class StudentData(BaseModel):
    gpa: float
    attendance: float
    credits_earned: int
    extracurricular_score: float
    previous_semester_gpa: float

class CareerInput(BaseModel):
    skills: List[str]
    interests: List[str]

@app.get("/")
def read_root():
    return {"message": "Student Retention ML API is online"}

@app.post("/ml/predict-risk")
def predict_risk(data: StudentData):
    # This is a placeholder for real ML model inference
    # In a real scenario, we would load a pre-trained XGBoost model here
    
    # Simple logic for demonstration
    risk_score = 100 - (data.gpa * 15 + data.attendance * 0.5)
    risk_score = max(0, min(100, risk_score))
    
    category = "Low"
    if risk_score > 70:
        category = "High"
    elif risk_score > 35:
        category = "Medium"
        
    return {
        "risk_score": round(risk_score, 2),
        "category": category,
        "recommendation": "Increase attendance" if data.attendance < 75 else "Maintain current performance"
    }

@app.post("/ml/recommend-career")
def recommend_career(input_data: CareerInput):
    # Placeholder for recommendation logic
    all_careers = [
        {"title": "Full-Stack Developer", "required_skills": ["React", "Node.js", "MongoDB"]},
        {"title": "Data Scientist", "required_skills": ["Python", "Statistics", "SQL"]},
        {"title": "Cloud Engineer", "required_skills": ["AWS", "Docker", "Kubernetes"]},
        {"title": "Cybersecurity Analyst", "required_skills": ["Networking", "Security+", "Linux"]},
    ]
    
    recommendations = []
    for career in all_careers:
        match_count = len(set(input_data.skills) & set(career["required_skills"]))
        match_percentage = (match_count / len(career["required_skills"])) * 100 if career["required_skills"] else 0
        
        # Add some random factor for variety in demo
        match_percentage = min(100, match_percentage + random.randint(0, 20))
        
        recommendations.append({
            "title": career["title"],
            "match_percentage": round(match_percentage, 2)
        })
    
    # Sort by match percentage
    recommendations.sort(key=lambda x: x["match_percentage"], reverse=True)
    
    return recommendations[:3]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
