import {
    RequestHandler
} from "express";
import { attemptsRepository } from "../repositories/db/attempts-db-repository";
import { subSeconds } from "date-fns";


export type RequestAttempt = {
    urlAndIp: string, date: string
}
export const ipLimiter: RequestHandler = async( req, res, next ) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const url = req.originalUrl
    const date = new Date(Date.now()).toISOString()
    const urlAndIp = url + ip
    await attemptsRepository.addNewAttempts(urlAndIp,
        date)
    const limit: number = 5
    const tenSecAgo = subSeconds(new Date(date),
        10)
        .toISOString()
    const shouldBlock = await attemptsRepository.getAttemptsCount(urlAndIp,
        tenSecAgo) > limit
    debugger
    if (shouldBlock) {
        return res.sendStatus(429)
    }
    return next()
}