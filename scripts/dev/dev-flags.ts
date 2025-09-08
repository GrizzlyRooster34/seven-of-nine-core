

export function devMode() {
  return process.env.NODE_ENV !== "production" && process.env.QUADRAN_DEV === "1";
}
