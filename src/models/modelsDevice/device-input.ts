export type SessionDBModel = {
    deviceId:	string
    issuedAt: number
    userId: string
    ip:	string | null
    title:	string | null
    lastActiveDate:	string
    expirationDate: Date
}