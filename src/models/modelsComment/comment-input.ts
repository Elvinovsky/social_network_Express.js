export type CommentInputModel = {
    content: string
    /**
     *maxLength: 300
     *minLength: 20
     */
}

export class CommentDBModel {
    constructor (public postId: string,
                 public content: string,
                 public commentatorInfo: CommentatorInfo,
                 public createdAt: string) {
    }
}

export class CommentatorInfo {
    constructor (  public  userId: string,
                    public userLogin: string) {
    }
}