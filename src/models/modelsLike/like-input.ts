export type LikeDBCommentInfo = {
    likesCount: number
    dislikesCount: number

}

export type LikeDBInfo  = {
    status: string
    userId: string
    postOrCommentId: string
    createdAt: Date
}