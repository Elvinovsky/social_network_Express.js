import * as dotenv from "dotenv";
dotenv.config()

export const settings = {
    MONGO_URI: process.env.MONGO_URL,
    ACCESS_JWT_SECRET: process.env.ACCESS_JWT_SECRET_KEY|| '123',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_JWT_SECRET_KEY || '543',
    EMAIL: process.env.AUTH_EMAIL,
    PASS: process.env.AUTH_PASS
}
