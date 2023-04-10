import {blogsCollection, postsCollection} from "../../database/runDB";
import {PostView} from "../../models/modelsPosts/post-view";
import {DeleteResult, ObjectId, WithId} from "mongodb";
import {BlogDBModel} from "../../models/modelsBlogs/blog-input";
import {PostDBModel} from "../../models/modelsPosts/post-input";
import {postMapping} from "../../functions/postsMapping";


export const postsRepository = {
    // тестовое удаление базы данных Постов
    async testingDeleteAllPosts(): Promise<DeleteResult> {
        return await postsCollection.deleteMany({})
    },
    //поиск поста по ID.
    async findPostById(id: string): Promise <PostView | null> {
        const post = await postsCollection.findOne({_id: new ObjectId(id)})
        if (!post){
            return null
        }
        return postMapping(post)
    },
    //создание и добавление нового поста в базу данных.
    async addNewPost(newPost: PostDBModel): Promise <PostView> {
       const result = await postsCollection.insertOne(newPost)
        return {
            id: result.insertedId.toString(),
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
       const updateResult = await postsCollection.updateOne({_id: new ObjectId(id)}, {$set: {title, shortDescription, content}})
       return updateResult.matchedCount === 1;
    },
    //поиск ID блога для поста.5
    async findBlogIdForPost(blogId: string):Promise <WithId<BlogDBModel> | null > {
        const blogIdForPost = await blogsCollection.findOne({_id: new ObjectId(blogId)})
        return blogIdForPost? blogIdForPost : null
    },
    // поиск и удаление поста по ID.
    async postByIdDelete(id: string):Promise <boolean> {
        const deleteResult = await postsCollection.deleteOne({_id: new ObjectId(id)})
        return deleteResult.deletedCount === 1
    }
}