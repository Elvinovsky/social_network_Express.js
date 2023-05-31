export type SessionInputModel = {
    ip:	string
    /**
     * IP address of device during signing in
     */
    title:	string
    /**
     * deviceName: for example Chrome 105 (received by parsing http header "user-agent")
     */
    lastActiveDate:	string
    /**
     *  Date of the last generating of refresh/access tokens
     */
    deviceId:	string
    /**
     * id of connected device session
     */
}
export type SessionDBModel = {
    deviceId:	string
    issuedAt: number
    userId: string
    ip:	string | null
    title:	string | null
    lastActiveDate:	string
    expirationDate: Date
}