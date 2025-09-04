import jwt from "jsonwebtoken";

export function signToken(payload, expiresIn = "1h") {
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET, { expiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET);
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return null;
  }
}
