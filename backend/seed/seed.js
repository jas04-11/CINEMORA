import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Movie from "../models/Movie.js";
import Theater from "../models/Theater.js";
import Show from "../models/Show.js";

dotenv.config();

const ROW_LETTERS = "ABCDEFGH";
const buildSeats = (rows, seatsPerRow) => {
  const seats = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= seatsPerRow; c++) {
      seats.push({ seatNumber: `${ROW_LETTERS[r]}${c}`, row: ROW_LETTERS[r], col: c, status: "available" });
    }
  }
  return seats;
};

const run = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({ role: "admin" }),
    Movie.deleteMany({}),
    Theater.deleteMany({}),
    Show.deleteMany({}),
  ]);

  console.log("Creating admin user...");
  await User.create({
    name: process.env.ADMIN_NAME || "Super Admin",
    email: process.env.ADMIN_EMAIL || "admin@cinema.com",
    password: process.env.ADMIN_PASSWORD || "Admin@123",
    role: "admin",
  });

  console.log("Creating movies...");
  const movies = await Movie.insertMany([
    {
      title: "Nebula Drift",
      description: "A crew of salvagers uncovers a signal that shouldn't exist at the edge of known space.",
      posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500",
      genre: ["Sci-Fi", "Thriller"],
      language: "English",
      durationMinutes: 128,
      releaseDate: new Date(),
      rating: 8.1,
    },
    {
      title: "The Last Ember",
      description: "A firekeeper in a dying kingdom must choose between duty and rebellion.",
      posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500",
      genre: ["Drama", "Fantasy"],
      language: "English",
      durationMinutes: 142,
      releaseDate: new Date(),
      rating: 7.6,
    },
    {
      title: "Turbo Circuit",
      description: "Underground street racers take on a corrupt racing syndicate.",
      posterUrl: "https://images.unsplash.com/photo-1517994112540-009c47ea476b?w=500",
      genre: ["Action"],
      language: "English",
      durationMinutes: 110,
      releaseDate: new Date(),
      rating: 6.9,
    },
  ]);

  console.log("Creating theaters...");
  const theaters = await Theater.insertMany([
    {
      name: "Cinemora Grand",
      city: "Chandigarh",
      address: "Sector 17, Chandigarh",
      screens: [
        { screenName: "Screen 1", rows: 8, seatsPerRow: 10 },
        { screenName: "Screen 2", rows: 6, seatsPerRow: 8 },
      ],
    },
    {
      name: "Cinemora Downtown",
      city: "Chandigarh",
      address: "Elante Mall, Chandigarh",
      screens: [{ screenName: "Screen 1", rows: 8, seatsPerRow: 10 }],
    },
  ]);

  console.log("Creating shows...");
  const today = new Date().toISOString().slice(0, 10);
  const shows = [];
  for (const movie of movies) {
    shows.push({
      movie: movie._id,
      theater: theaters[0]._id,
      screenName: "Screen 1",
      showDate: today,
      showTime: "18:30",
      price: 220,
      seats: buildSeats(8, 10),
    });
    shows.push({
      movie: movie._id,
      theater: theaters[1]._id,
      screenName: "Screen 1",
      showDate: today,
      showTime: "21:00",
      price: 250,
      seats: buildSeats(8, 10),
    });
  }
  await Show.insertMany(shows);

  console.log("Seed complete. Admin login: ", process.env.ADMIN_EMAIL || "admin@cinema.com", "/", process.env.ADMIN_PASSWORD || "Admin@123");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
