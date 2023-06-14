
export type CommentInputModel = {
    content: string
    /**
     *maxLength: 300
     *minLength: 20
     */
}

export type CommentDBModel = {
    postId: string,
    content: string,
    commentatorInfo: CommentatorInfo,
    createdAt: string,
    likesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: string
    }
}

export class CommentatorInfo {
    constructor ( public userId: string, public userLogin: string ) {
    }
}