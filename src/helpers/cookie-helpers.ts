import { CookieOptions } from "express";

export const refreshCookieOptions: CookieOptions = { httpOnly: true, sameSite: 'none', secure: true }