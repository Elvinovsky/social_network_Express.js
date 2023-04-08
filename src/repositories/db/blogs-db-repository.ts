import {blogsCollection} from "../../database/runDB";
import {BlogDBModel, BlogViewModel} from "../../models/modelsBlogs/blogViewModel";
import {ObjectId, DeleteResult, WithId} from "mongodb";

function blogMapping(blog: WithId<BlogDBModel>): BlogViewModel {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}

export const blogsRepository = {
    //тестовое удаление базы данных о блогах.
    async testingDeleteAllBlogs(): Promise<DeleteResult> {
        return await blogsCollection.deleteMany({})
    },
    //поиск блога по ID.
    async findBlogById(id: string): Promise<BlogViewModel | null> {

        const blog = await blogsCollection.findOne({_id: new ObjectId(id)})
        if (!blog) {
            return null
        }
        return blogMapping(blog)
    },
    //создание и добавление нового блога.
    async addNewBlog(createBlog: BlogDBModel): Promise<BlogViewModel> {
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
