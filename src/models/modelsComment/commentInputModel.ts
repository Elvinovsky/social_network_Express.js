
export type CommentViewModel = {
    id:	string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    }
    createdAt: string
}
export type CommentDBModel = {
    postId: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    }
    createdAt: string
}

export type CommentInputModel = {
    content: string
    /**
     *maxLength: 300
     *minLength: 20
     */
}
export type LoginSuccessViewModel = {
    accessToken: string
}

