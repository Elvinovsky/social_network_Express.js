export type LoginInput = {
    loginOrEmail: string,
    password: string
}
export type UsedTokenByUser = {
    userId: string,
    refreshToken: string
}