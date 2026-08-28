// Generates a human-friendly random alphanumeric booking code, e.g. "TCK-7F3K9A"
export const generateBookingCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing chars (0/O, 1/I)
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `TCK-${code}`;
};

export default generateBookingCode;
