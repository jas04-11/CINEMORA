import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="font-display text-2xl tracking-wide text-gold">
          CINEMORA
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link to="/" className="text-cream/80 hover:text-gold transition-colors">
            Movies
          </Link>
          {user && (
            <Link to="/my-bookings" className="text-cream/80 hover:text-gold transition-colors">
              My Bookings
            </Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" className="text-cream/80 hover:text-gold transition-colors">
              Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-muted sm:inline">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="focus-ring rounded-full border border-line px-4 py-1.5 text-cream/80 hover:border-gold hover:text-gold transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="focus-ring rounded-full bg-gold px-4 py-1.5 font-semibold text-ink hover:bg-gold/90 transition-colors"
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
