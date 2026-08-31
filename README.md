# 🎬 Cinemora — Movie Ticket Booking App

Cinemora is a **MERN-stack movie ticket booking application** built with React, Node.js, Express.js, and MongoDB. It allows users to browse movies, select shows and seats, and book tickets securely.

## 🚀 Features

- User registration and JWT login
- Browse and search movies
- View shows and showtimes
- Interactive seat selection
- **15-minute seat locking**
- Prevents double booking using MongoDB atomic operations
- Real-time seat updates using Socket.io
- Pay-at-counter booking
- Booking code and PDF receipt generation
- My Bookings and booking history
- Admin dashboard
- Movie, theater, screen, show and booking management
- Automatic release of expired seat locks

## 🧰 Tech Stack

**Frontend:** React.js, Vite, JavaScript, CSS/Tailwind CSS, Axios, Socket.io

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Socket.io, PDFKit

## 📁 Project Structure

movie-ticket-app/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── jobs/
│   └── server.js
│
└── frontend/
    ├── src/
    ├── components/
    ├── pages/
    └── App.jsx

## 🎟️ Booking Flow
Login
  ↓
Select Movie
  ↓
Select Show
  ↓
Select Seats
  ↓
Proceed to Pay
  ↓
Seats Locked for 15 Minutes
  ↓
Booking Confirmed
  ↓
Booking Code / PDF Receipt

## 🔒 Concurrency & Double Booking

Cinemora uses MongoDB's atomic findOneAndUpdate() to lock seats only when their status is available.

Available → Locked → Booked

If two users try to book the same seat, only one request gets the lock. The other receives 409 Conflict. This prevents double booking.

Expired locks are automatically released by a server-side cleanup job.

## 🔮 Future Enhancements
Razorpay/Stripe online payment
QR-code tickets
Email/SMS notifications
Movie reviews and ratings
Seat categories and dynamic pricing
Movie recommendation system

## 📜 License

This project is developed for academic and educational purposes.
