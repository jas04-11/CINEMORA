# 🎬 Cinemora — MERN Movie Ticket Booking App

Cinemora is a full-stack **MERN Movie Ticket Booking Application** built using React, Node.js, Express.js, and MongoDB.

The application allows users to browse movies, select shows, choose seats, and book movie tickets. It also includes an admin panel for managing movies, theaters, screens, shows, and bookings.

A major feature of Cinemora is its **15-minute seat-locking mechanism**, which prevents double booking during concurrent seat-selection requests.

---

## 🚀 Features

### 👤 User Features

- User registration and login
- JWT-based authentication
- Browse and search movies
- View available shows and showtimes
- Interactive seat selection
- 15-minute seat-lock countdown
- Pay-at-counter booking
- Unique booking code generation
- PDF receipt generation
- My Bookings / booking history
- Re-download booking receipts
- Real-time seat availability updates

### 🛠️ Admin Features

- Admin login
- Role-based authorization
- Dashboard statistics
- Movie CRUD operations
- Theater management
- Screen management
- Show scheduling
- Automatic seat-grid generation
- View all bookings
- Mark bookings as paid at counter

---

## 🔒 Concurrency & Seat Locking

Cinemora implements a **15-minute temporary seat-locking mechanism**.

When a user selects seats and clicks **Proceed to Pay**:

1. The backend checks seat availability.
2. Available seats are atomically locked.
3. A 15-minute expiration time is generated.
4. The frontend displays a countdown timer.
5. If the booking is completed, seats become permanently booked.
6. If the timer expires, the seats are released automatically.

### Seat Lifecycle

```text
Available
    ↓
Locked
    ↓
Booked
