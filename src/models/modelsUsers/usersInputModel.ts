export type UserInputModel = {
    login:	string,
    /**
     * maxLength: 10, minLength: 3, pattern: ^[a-zA-Z0-9_-]*$
     */
    password: string
    /**
     *   maxLength: 20,  minLength: 6
     */
    email: string
    /**
     * pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
     */
}