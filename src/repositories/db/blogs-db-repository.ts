import {blogsCollection} from "../../database/runDB";
import {BlogView} from "../../models/modelsBlogs/blog-view";
import {ObjectId, DeleteResult} from "mongodb";
import {BlogDBModel} from "../../models/modelsBlogs/blog-input";
import {blogMapping} from "../../functions/blogsMapping";


export const blogsRepository = {
    //тестовое удаление базы данных о блогах.
    async testingDeleteAllBlogs(): Promise<DeleteResult> {
        return await blogsCollection.deleteMany({})
    },
    //поиск блога по ID.
    async findBlogById(id: string): Promise<BlogView | null> {

        const blog = await blogsCollection.findOne({_id: new ObjectId(id)})
        if (!blog) {
            return null
        }
        return blogMapping(blog)
    },
    //создание и добавление нового блога.
    async addNewBlog(createBlog: BlogDBModel): Promise<BlogView> {
        const result = await blogsCollection.insertOne(createBlog)

        return {
            id: result.insertedId.toString(),
            name: createBlog.name,
            description: createBlog.description,
            websiteUrl: createBlog.websiteUrl,
            createdAt: createBlog.createdAt,
            isMembership: createBlog.isMembership
        }
    },
    //обновление блога по айди.
    async updateBlogById(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const result = await blogsCollection.updateOne({_id: new ObjectId(id)}, {$set: {name, description, websiteUrl}})
        return result.matchedCount === 1
    },
    //поиск блога по ID для удаления.
    async searchBlogByIdDelete(id: string): Promise<boolean> {
        const deleteResult = await blogsCollection.deleteOne({_id: new ObjectId(id)})
        return deleteResult.deletedCount === 1
    }
}
