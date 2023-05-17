export type RegistrationConfirmationCodeModel = {
    code: string
    /**
     * Code that be sent via Email inside link
     */
}
export type RegistrationEmailResending = {
    email: string
    /**
     *    pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
     *     Email of already registered but not confirmed user
     */
}
export type PasswordRecoveryInputModel = {
    email: string
}
export type NewPasswordRecoveryInputModel = {
    newPassword: string
    /**
     * maxLength: 20
     * minLength: 6
     */
    recoveryCode: string
}