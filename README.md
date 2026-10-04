# Sepehr Real Estate

Sepehr is a real estate marketplace for browsing properties and connecting buyers with sellers. It combines property discovery and listing management with role-based seller and admin dashboards. The application also includes account verification and real-time chat.

## ✨ Features

- Browse property listings and view detailed galleries, features, and similar properties.
- Filter listings by location, transaction type, price, property type, and bedrooms.
- Register and sign in with phone-based OTP verification; reset forgotten passwords through an OTP flow.
- Save properties to a buyer wishlist and contact sellers through inquiries or chat.
- Create, edit, and manage listings from the seller dashboard, with listing status and admin approval controls.
- Manage users, seller requests, listings, contact messages, and dashboard reports from the admin dashboard.
- Exchange chat messages with live Socket.IO updates, read status, and message deletion.
- Upload property images and profile photos through the API.

## 🛠 Tech Stack

**Frontend**

- React 19 and Vite
- React Router, Redux Toolkit, and React Redux
- Tailwind CSS 4
- Socket.IO Client
- Swiper, Framer Motion, React Select, and React Hot Toast

**Backend**

- Node.js with Express 5
- MongoDB with Mongoose
- Socket.IO
- JWT authentication and bcryptjs password hashing
- Multer file uploads
- Nodemailer and LimoSMS API integrations

## 📸 Screenshots

### Home page

![Sepehr real estate home page](./previewImg/github-image.jpg)

## 🎥 Demo

Demo video: **[Add a demo video link here]**

## 📂 Project Structure

```text
.
├── api/
│   ├── Modules/       # API routes, controllers, models, validators
│   ├── Middlewares/   # Authentication and role authorization
│   ├── Socket/        # Socket.IO chat events
│   ├── Public/        # Uploaded and supplied image files
│   ├── server.js      # API and database startup
│   └── package.json
├── client/
│   ├── src/           # React pages, components, state, and utilities
│   ├── public/
│   └── package.json
└── previewImg/
    └── github-image.jpg
```

## ⚙️ Installation

The frontend and backend are separate npm projects. Use Node.js and MongoDB, and configure the environment variables below before starting the API.

### 1. Start the API

```bash
cd api
npm install
npm run dev
```

The API defaults to port `5001` and connects to the MongoDB URI in `DATA_BASE`.

### 2. Start the client

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Vite serves the client at `http://localhost:5173` by default. Set `VITE_BASE_URL` to the API base URL (including `/api`) and `VITE_BASE_FILE` to the API origin used to load uploaded files.

> **Realtime chat configuration:** the API defaults to port `5001`, while the Socket.IO client URL is currently hard-coded to `http://localhost:5000` in `client/src/Utils/socket.js`. Align these addresses in the code for local realtime chat to connect.

## 🔐 Authentication

Registration and password recovery use one-time codes sent to a phone number through the LimoSMS integration. After verification, users sign in with a phone number and password. The API issues JWTs for protected requests and checks buyer, seller, and admin roles for restricted operations.

## 🔑 Environment Variables

Create `api/.env` for backend settings and `client/.env` for Vite settings. Use your own service credentials; do not commit secrets.

**`api/.env`**

```env
PORT=5001
DATA_BASE=mongodb://127.0.0.1:27017/Sepehr
SECRET_KEY=replace-with-a-long-random-secret
SMS_KEY=your-limosms-api-key
EMAIL_USER=your-sending-email
EMAIL_APP_PASSWORD=your-email-app-password
ADMIN_EMAIL=admin-notification-recipient
```

The email settings are used for contact-message notifications; SMS and database settings support verification and data storage.

**`client/.env`**

```env
VITE_BASE_URL=http://localhost:5001/api
VITE_BASE_FILE=http://localhost:5001
```

The Socket.IO client address is configured separately in `client/src/Utils/socket.js` and currently defaults to `http://localhost:5000`.

## 🚀 Future Improvements

- Make the API and Socket.IO client addresses configurable from environment variables and keep their defaults aligned.
- Add automated tests for authentication, listing workflows, and role-protected API routes.
- Add a deployed demo and screenshots for the listing, seller, and admin views.

## 👩‍💻 Author

**Yamna Abhari**  
GitHub: [YamnaAbhari](https://github.com/YamnaAbhari)  
LinkedIn: [yamna-abhari](https://www.linkedin.com/in/yamna-abhari)

---

