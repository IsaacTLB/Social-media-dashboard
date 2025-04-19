// config/index.js
import dotenv from "dotenv";
dotenv.config();

export const {
  SECRET_ACCESS_TOKEN,
  SECRET_REFRESH_TOKEN,
  MONGO_URI,
  NODE_ENV,
  PORT,
  CLIENT_URL,
  COOKIE_NAME
} = process.env;
