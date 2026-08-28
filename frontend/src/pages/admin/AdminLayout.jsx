import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/movies", label: "Movies" },
  { to: "/admin/theaters", label: "Theaters" },
  { to: "/admin/shows", label: "Shows" },
  { to: "/admin/bookings", label: "Bookings" },
];

const AdminLayout = () => {
  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-5 py-10">
      <aside className="w-48 flex-none">
        <p className="mb-3 text-xs tracking-[0.3em] text-muted uppercase">Admin</p>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `focus-ring rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive ? "bg-gold/15 text-gold" : "text-cream/80 hover:bg-panel2"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
