# fullstack-tasks-app

Complete MERN stack task management app.

Run backend and frontend as described in the project instructions.

## Register
![Register](frontend/public/Register.png)

## Login
![Login](frontend/public/Login.png)

## UserDashboard
![UserDashboard](frontend/public/UserDashboard.png)

## AdminPanel
![AdminPanel](frontend/public/AdminPanel.png)

## ViewTasks
![ViewTasks](frontend/public/ViewTasks.png)

## PromoteUser
![ViewTasks](frontend/public/PromoteUser.png)


# Fullstack Tasks App

A secure and scalable full-stack task management application with:

JWT authentication

Role-based access control

CRUD operations

Form validation

Security middlewares

API documentation

Request and error logging (Winston)

This project includes a backend REST API (Node.js + Express + MongoDB) and a React frontend to interact with the system.


# Tech Stack

## Backend

Node.js + Express

MongoDB + Mongoose

JWT Authentication + Bcrypt

Joi Request Validation

Winston Logger (combined.log, error.log)

Helmet, CORS, Rate Limiting, Sanitization

Swagger API Documentation


## Frontend

React (Vite)

Redux Toolkit

Axios (with interceptors)

TailwindCSS

Protected Routes & Auth State



# Getting Started — Run Locally

## 1️⃣ Clone the Repository
git clone https://github.com/Shivp45/FullStack_Tasks_Manager.git
cd fullstack-tasks-app

## 2️⃣ Backend Setup
cd backend
npm install

### Create .env inside /backend:

PORT=5000
MONGO_URI=your_mongodb_uri_here
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
NODE_ENV=development


### Start the backend server:
npm run dev

### If successful, you should see:
Server running on http://localhost:5000
Connected to MongoDB



### API Documentation

Once backend is running:

Swagger Docs → http://localhost:5000/api-docs
Health Check → http://localhost:5000/api/health



## 3️⃣ Frontend Setup
Open a second terminal:

cd frontend
npm install


### Run the frontend:
npm run dev

The frontend will start at:
http://localhost:5173/



## 4️⃣ Login & Testing

You can:

Register new users
Login
Create / update / delete tasks
Test protected routes
View admin-only functionality (if assigned role = admin)
