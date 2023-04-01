import {blogsCollection, postsCollection} from "../../database/runDB";
import {PostViewModel} from "../../models/modelsPosts/postViewModel";
import {BlogViewModel} from "../../models/modelsBlogs/blogViewModel";
import {DeleteResult} from "mongodb";
import {blockMongo_Id} from "../../functions/filters";


export const postsRepository = {
    // тестовое удаление базы данных Постов
    async testingDeleteAllPosts(): Promise<DeleteResult> {
        return await postsCollection.deleteMany({})
    },
    //поиск поста по ID.
    async findPostById(id: string): Promise <PostViewModel | null> {
        return  await postsCollection.findOne({id}, blockMongo_Id)
    },
    //создание и добавление нового поста в базу данных.
    async addNewPost(newPost: PostViewModel): Promise <PostViewModel> {
        await postsCollection.insertOne(newPost)
        return {
            id: newPost.id,
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId:	newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt
        }
    },
    // обновление поста по ID.
    async updatePostById(id: string, title: string, shortDescription: string, content: string,): Promise <boolean> {
       const updateResult = await postsCollection.updateOne({id}, {$set: {title, shortDescription, content}})
       return updateResult.matchedCount === 1;
    },
    //поиск ID блога для поста.
    async searchBlogIdForPost(blogId: string):Promise <BlogViewModel | null > {
        const blogIdForPost = await blogsCollection.findOne({id: blogId})
        return blogIdForPost? blogIdForPost : null
    },
    // поиск и удаление поста по ID.
    async postByIdDelete(id: string):Promise <boolean> {
        const deleteResult = await postsCollection.deleteOne({id})
        return deleteResult.deletedCount === 1
    }
}