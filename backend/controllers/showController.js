import Show from "../models/Show.js";
import Theater from "../models/Theater.js";

const ROW_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const buildSeatGrid = (rows, seatsPerRow) => {
  const seats = [];
  for (let r = 0; r < rows; r++) {
    const rowLetter = ROW_LETTERS[r] || `R${r + 1}`;
    for (let c = 1; c <= seatsPerRow; c++) {
      seats.push({
        seatNumber: `${rowLetter}${c}`,
        row: rowLetter,
        col: c,
        status: "available",
      });
    }
  }
  return seats;
};

// @route GET /api/shows?movie=&theater=&date=
export const listShows = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.movie) filter.movie = req.query.movie;
    if (req.query.theater) filter.theater = req.query.theater;
    if (req.query.date) filter.showDate = req.query.date;

    const shows = await Show.find(filter)
      .populate("movie", "title posterUrl durationMinutes language")
      .populate("theater", "name city")
      .select("-seats") // list view doesn't need the full seat map
      .sort({ showDate: 1, showTime: 1 });

    res.json(shows);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/shows/:id  (full seat map, with expired locks lazily released)
export const getShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate("movie", "title posterUrl durationMinutes language")
      .populate("theater", "name city");
    if (!show) return res.status(404).json({ message: "Show not found" });

    // Lazily release any locks that expired since the cron job last ran,
    // so the seat map the user sees is always accurate.
    const now = new Date();
    let changed = false;
    show.seats.forEach((seat) => {
      if (seat.status === "locked" && seat.lockExpiresAt && seat.lockExpiresAt < now) {
        seat.status = "available";
        seat.lockedBy = null;
        seat.lockedAt = null;
        seat.lockExpiresAt = null;
        changed = true;
      }
    });
    if (changed) await show.save();

    res.json(show);
  } catch (err) {
    next(err);
  }
};

// ----- Admin -----

export const createShow = async (req, res, next) => {
  try {
    const { movie, theater, screenName, showDate, showTime, price } = req.body;
    const theaterDoc = await Theater.findById(theater);
    if (!theaterDoc) return res.status(404).json({ message: "Theater not found" });

    const screen = theaterDoc.screens.find((s) => s.screenName === screenName);
    if (!screen) return res.status(404).json({ message: "Screen not found on theater" });

    const seats = buildSeatGrid(screen.rows, screen.seatsPerRow);

    const show = await Show.create({
      movie,
      theater,
      screenName,
      showDate,
      showTime,
      price,
      seats,
    });

    res.status(201).json(show);
  } catch (err) {
    next(err);
  }
};

export const updateShow = async (req, res, next) => {
  try {
    const { showDate, showTime, price, isActive } = req.body;
    const show = await Show.findByIdAndUpdate(
      req.params.id,
      { showDate, showTime, price, isActive },
      { new: true, runValidators: true }
    );
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json(show);
  } catch (err) {
    next(err);
  }
};

export const deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json({ message: "Show removed" });
  } catch (err) {
    next(err);
  }
};

export const listShowsAdmin = async (req, res, next) => {
  try {
    const shows = await Show.find()
      .populate("movie", "title")
      .populate("theater", "name city")
      .select("-seats")
      .sort({ showDate: -1, showTime: -1 });
    res.json(shows);
  } catch (err) {
    next(err);
  }
};
