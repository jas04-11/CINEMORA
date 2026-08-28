import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import ShowSeats from "./pages/ShowSeats.jsx";
import Payment from "./pages/Payment.jsx";
import BookingConfirmation from "./pages/BookingConfirmation.jsx";
import MyBookings from "./pages/MyBookings.jsx";

import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageMovies from "./pages/admin/ManageMovies.jsx";
import ManageTheaters from "./pages/admin/ManageTheaters.jsx";
import ManageShows from "./pages/admin/ManageShows.jsx";
import AdminBookings from "./pages/admin/AdminBookings.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movies/:id" element={<MovieDetails />} />

        <Route
          path="/shows/:showId/seats"
          element={
            <ProtectedRoute>
              <ShowSeats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-confirmation"
          element={
            <ProtectedRoute>
              <BookingConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="movies" element={<ManageMovies />} />
          <Route path="theaters" element={<ManageTheaters />} />
          <Route path="shows" element={<ManageShows />} />
          <Route path="bookings" element={<AdminBookings />} />
        </Route>

        <Route path="*" element={<p className="mx-auto max-w-2xl px-5 py-20 text-center text-muted">Page not found.</p>} />
      </Routes>
    </div>
  );
};

export default App;
