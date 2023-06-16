import { LikeInfoView } from "../modelsLike/like-view";

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
        newestLikes: LikeInfoView[]
    }
}
