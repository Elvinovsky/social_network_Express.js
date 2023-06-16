export type PostView = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string
        newestLikes: [{
            addedAt: string, userId: string | null, login: string | null
        }]
    }
}
