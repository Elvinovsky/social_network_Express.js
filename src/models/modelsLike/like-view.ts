export type LikesInfoViewModel = {
    likesCount: number

    dislikesCount: number

    myStatus: string

}

enum status {  'None', 'Like', 'Dislike' }