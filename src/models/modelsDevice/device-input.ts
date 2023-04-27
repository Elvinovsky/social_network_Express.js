export type DeviceInputModel = {
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
    id: string
    /**
     * id of connected device session
     */
}
export type DeviceDBModel = {
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
    id: string
    /**
     * id of connected device session
     */
}