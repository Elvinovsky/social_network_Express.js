export type BlogViewModel = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    /**
     * True if user has not expired membership subscription to blog
     */
    isMembership: boolean
}