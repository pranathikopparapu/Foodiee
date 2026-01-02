🍔 Foodiee – Online Food Ordering Platform (MERN Stack)

🔗 Live Website: https://foodiee-liard.vercel.app/

🔗 Backend API: https://foodiee-backend.onrender.com

📌 Project Overview

Foodiee is a full-stack online food ordering web application built using the MERN stack.
It allows users to browse food items, place orders, track order status, and submit ratings & reviews after delivery — similar to platforms like Myntra / Swiggy.

The application supports role-based access, secure authentication, real-time order updates, and persistent reviews visible to all users.

🚀 Key Features
👤 User Features

User registration & login using JWT authentication

Browse food items with ratings & reviews

Add items to cart & place orders

Auto order delivery after 5 minutes

Rate & review products only after delivery

View order history & review status in user dashboard

⭐ Reviews & Ratings

Only delivered buyers can review

Reviews stored in MongoDB

Average rating auto-calculated

Latest review shown on homepage

“View All Reviews” option for full review list

🛠️ Admin Features

Add, edit, delete food items

Manage availability of food items

View all orders and users

🧑‍💻 Tech Stack
Frontend

React.js

Axios

Tailwind CSS

React Router

Backend

Node.js

Express.js

MongoDB (Mongoose)

JWT Authentication

Nodemailer (Email notifications)

Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

📂 Project Structure
Foodiee/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/api.js
│   │   └── App.js
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── config/db.js
│   ├── server.js
│   └── package.json
│
└── README.md

⚙️ Environment Variables
Backend (.env)
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password


⚠️ Note: .env and node_modules are excluded using .gitignore.

▶️ Running Locally
1️⃣ Clone Repository
git clone https://github.com/pranathikopparapu/Foodiee.git
cd Foodiee

2️⃣ Backend Setup
cd backend
npm install
npm start

3️⃣ Frontend Setup
cd frontend
npm install
npm start


Frontend runs on: http://localhost:3000
Backend runs on: http://localhost:5000
