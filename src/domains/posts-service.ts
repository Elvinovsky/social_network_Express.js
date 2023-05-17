import { PostView } from "../models/modelsPosts/post-view";
import { postsRepository } from "../repositories/db/posts-db-repository";
import { BlogDBModel } from "../models/modelsBlogs/blog-input";
import { WithId } from "mongodb";
import { PostDBModel } from "../models/modelsPosts/post-input";

export const postsService = {

    async searchBlogIdForPost ( blogId: string ): Promise<WithId<BlogDBModel> | null> {
        return await postsRepository.findBlogIdForPost(blogId)
    },

    async findPostById ( id: string ): Promise<PostView | null> {
        return await postsRepository.findPostById(id)
    },

    async createPost ( title: string, shortDescription: string, content: string, blogId: string ): Promise<PostView> {
        const outputBlogName: string = postsRepository.findBlogIdForPost.name
        const newPost: PostDBModel = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: outputBlogName,
            createdAt: new Date().toISOString()
        }
        return await postsRepository.addNewPost(newPost)
    },

    async updatePostById ( id: string, title: string, shortDescription: string, content: string, ): Promise<boolean> {
        return postsRepository.updatePostById(id,
            title,
            shortDescription,
            content)
    },

    async postByIdDelete ( id: string ): Promise<boolean> {
        return await postsRepository.postByIdDelete(id)
    }
}