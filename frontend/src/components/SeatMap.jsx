import React, { useMemo } from "react";

// seats: array of { seatNumber, row, col, status, lockedBy }
// selected: array of seatNumber strings currently chosen by this user (pre-lock)
const SeatMap = ({ seats, selected, onToggle, currentUserId, maxSelectable = 8 }) => {
  const rows = useMemo(() => {
    const grouped = {};
    seats.forEach((s) => {
      grouped[s.row] = grouped[s.row] || [];
      grouped[s.row].push(s);
    });
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [seats]);

  const seatState = (seat) => {
    if (seat.status === "booked") return "booked";
    if (seat.status === "locked") {
      return String(seat.lockedBy) === String(currentUserId) ? "locked-mine" : "locked-other";
    }
    if (selected.includes(seat.seatNumber)) return "selected";
    return "available";
  };

  const stateClasses = {
    available:
      "bg-panel2 border-line text-cream hover:border-gold hover:text-gold cursor-pointer",
    selected: "bg-gold border-gold text-ink cursor-pointer",
    "locked-mine": "bg-gold/40 border-gold text-ink cursor-pointer",
    "locked-other": "bg-line/60 border-line text-muted cursor-not-allowed opacity-60",
    booked: "bg-crimson/30 border-crimson/50 text-crimson/70 cursor-not-allowed",
  };

  const handleClick = (seat) => {
    const state = seatState(seat);
    if (state === "locked-other" || state === "booked") return;
    if (state === "available" && selected.length >= maxSelectable) return;
    onToggle(seat.seatNumber);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="h-2 w-3/4 max-w-md rounded-full bg-gradient-to-r from-transparent via-gold/70 to-transparent"
        aria-hidden="true"
      />
      <p className="text-xs tracking-[0.3em] text-muted uppercase">Screen this way</p>

      <div className="flex flex-col gap-2">
        {rows.map(([row, rowSeats]) => (
          <div key={row} className="seat-grid grid-flow-col">
            <span className="w-5 self-center text-xs text-muted">{row}</span>
            {rowSeats
              .sort((a, b) => a.col - b.col)
              .map((seat) => (
                <button
                  key={seat.seatNumber}
                  type="button"
                  onClick={() => handleClick(seat)}
                  disabled={seatState(seat) === "locked-other" || seatState(seat) === "booked"}
                  aria-label={`Seat ${seat.seatNumber} - ${seatState(seat)}`}
                  className={`focus-ring h-8 w-8 rounded-t-md border text-[10px] font-semibold transition-colors ${stateClasses[seatState(seat)]}`}
                >
                  {seat.col}
                </button>
              ))}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-xs text-muted">
        <Legend swatch="bg-panel2 border border-line" label="Available" />
        <Legend swatch="bg-gold" label="Selected" />
        <Legend swatch="bg-line/60" label="Locked by another" />
        <Legend swatch="bg-crimson/30" label="Booked" />
      </div>
    </div>
  );
};

const Legend = ({ swatch, label }) => (
  <span className="flex items-center gap-1.5">
    <span className={`h-3 w-3 rounded-sm ${swatch}`} />
    {label}
  </span>
);

export default SeatMap;
