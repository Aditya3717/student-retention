# Student Retention Project

A comprehensive system designed to manage, analyze, and predict student academic outcomes and retention using modern web technologies and machine learning.

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)

## Overview
The Student Retention platform provides an institutional-grade interface for both administrators and students. It allows educational institutions to bulk-import student academic records, visualize performance trends via interactive dashboards, and leverage machine learning to predict student retention and academic success.

## Project Structure
The repository is structured into distinct modules:

- **Frontend/**: Contains the user interfaces built with React and Vite.
  - `admin/`: The Admin Dashboard for managing students, initiating ML model training, and viewing system-wide analytics.
  - `student/`: The Student Portal offering a premium, glassmorphism-designed dashboard for viewing personal academic progress, predictive analytics, and career guidance.
  - `landing/`: The public-facing landing page.
- **Backend/**: The Node.js/Express REST API that handles data persistence, authentication, and integration with the ML service. It uses MongoDB via Mongoose.
- **ML/**: The Machine Learning service written in Python, featuring a Random Forest model capable of predicting student retention based on academic history.

## Tech Stack
- **Frontend**: React 19, Vite, TailwindCSS v4, Framer Motion, Chart.js, Lucide React
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT authentication, Multer/XLSX for Excel imports
- **Machine Learning**: Python, Scikit-learn (RandomForest)

## Features
- **Role-Based Access Control**: Separate portals and access layers for Students and Administrators.
- **Data Pipeline**: Seamless Excel bulk-import of student records into the MongoDB database, complete with automated GPA calculation and parsing.
- **Interactive Dashboards**: High-fidelity, visually premium dashboards using glassmorphism design principles, micro-animations, and dynamic charts to present data.
- **Predictive Analytics**: An integrated ML pipeline that administrators can trigger to train a Random Forest model on current data, which subsequently powers retention predictions on the student portals.
- **Performance Optimization**: Efficient frontend caching, API utility functions, and responsive UI components.

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/Aditya3717/student-retention.git
cd student-retention
```

### 2. Backend Setup
```bash
cd Backend
npm install
```
- A `.env.example` file is provided in the `Backend` directory. Copy it to create your own `.env` file:
  ```bash
  cp .env.example .env
  ```
- **Team Collaboration**: To share data across the team, update the `MONGODB_URI` in your new `.env` file to point to your shared MongoDB Atlas cluster connection string. If developing locally without a team, you can leave it as the default `mongodb://localhost:27017/...`.
- **Security Note**: Never commit your `.env` file to version control. It is already included in `.gitignore`.
- Run the server:
  ```bash
  npm run dev
  ```

### 3. Frontend Setup
The project uses three separate Vite applications for the frontend.
For example, to run the Student portal:
```bash
cd Frontend/student
npm install
npm run dev
```
(Repeat for `admin` and `landing` as needed.)

### 4. ML Service Setup
```bash
cd ML
pip install -r requirements.txt
python main.py
```

## Usage
1. Ensure the MongoDB database is running and the Express backend is connected.
2. Ensure the Python ML service is running to handle training and prediction requests.
3. Access the Admin portal to import student data (`.xlsx` files) and initiate ML training.
4. Access the Student portal to view individualized dashboards, academic predictions, and career guidance.
