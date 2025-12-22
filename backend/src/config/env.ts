import dotenv from "dotenv";

dotenv.config({ quiet: true });

const env = {
  NODE_ENV: process.env.NODE_ENV,
  SERVER_PORT: parseInt(process.env.SERVER_PORT, 10),
  SESSION_SECRET: process.env.SESSION_SECRET,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: parseInt(process.env.DB_PORT, 10),
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
};

export default env;
