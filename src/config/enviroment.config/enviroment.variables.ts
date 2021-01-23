import { Environment } from "./enviroment.variable.td";
import dotenv from 'dotenv';

dotenv.config();

export const environment: Environment = {
  server: {
    port: Number(process.env.PORT),
  },
  throttling: {
    windowMs: Number(process.env.WINDOWMS), // 24 hrs in milliseconds
    max: Number(process.env.MAX),
    message: 'You have exceeded the 100 requests in 24 hrs limit!',
    headers: Boolean(process.env.HEADERS),
  }
}