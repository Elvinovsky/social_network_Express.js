import {postViewModel} from "../models/modelsPosts/postViewModel";
import {postsRepository} from "../repositories/db/posts-db-repository";
import {blogViewModel} from "../models/modelsBlogs/blogViewModel";
import {blogsCollection} from "../database/runDB";


export const postsService = {
    async searchBlogIdForPost(blogId: string):Promise <blogViewModel | null > {
        return await postsRepository.searchBlogIdForPost(blogId)

    },
    async findPostById(id: string): Promise <postViewModel | null> {
        return await postsRepository.findPostById(id)
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise <postViewModel> {
        const outputBlogName: string = postsRepository.searchBlogIdForPost.name
        const newPost: postViewModel = {
            id: (+(new Date())).toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId:	blogId,
            blogName: outputBlogName,
            createdAt: new Date().toISOString()
        }
        return await postsRepository.addNewPost(newPost)
    },
    async updatePostById(id: string, title: string, shortDescription: string, content: string,): Promise <boolean> {
        return postsRepository.updatePostById(id, title, shortDescription, content)
    },
    async postByIdDelete(id: string):Promise <boolean> {
        return  await postsRepository.postByIdDelete(id)
    }
}