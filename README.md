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
<img width="242" height="381" alt="image" src="https://github.com/user-attachments/assets/21e043a7-36c2-49d6-9c7d-373235db910c" />

## 🎟️ Booking Flow
<img width="326" height="402" alt="image" src="https://github.com/user-attachments/assets/04fb1fb2-e713-464f-a763-caee3a6e528a" />

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
