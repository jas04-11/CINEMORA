let ioInstance = null;

export const setIO = (io) => {
  ioInstance = io;
};

// Notify everyone viewing a show's seat map that something changed, so
// other users see "already booked / locked" seats update live instead of
// only finding out when they click.
export const emitSeatUpdate = (showId) => {
  if (ioInstance) {
    ioInstance.to(`show:${showId}`).emit("seatUpdate", { showId });
  }
};
