export type LoginInput = {
    loginOrEmail: string,
    password: string
}
export type UsedTokenByUser = { // todo refactoring
    userId: string,
    refreshToken: string
}