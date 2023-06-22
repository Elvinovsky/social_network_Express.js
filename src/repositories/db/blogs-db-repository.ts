import { BlogView } from "../../models/modelsBlogs/blog-view";
import {
    ObjectId,
    DeleteResult
} from "mongodb";
import { BlogDBModel } from "../../models/modelsBlogs/blog-input";
import { blogMapping } from "../../functions/blogsMapping";
import { BlogModelClass } from "../../models/mongoose/models";


export const blogsRepository = {
    //тестовое удаление базы данных о блогах.
    async testingDeleteAllBlogs (): Promise<DeleteResult> {
        return await BlogModelClass.deleteMany({})
    }, //поиск блога по ID.
    async findBlogById ( id: string ): Promise<BlogView | null> {

        const blog = await BlogModelClass.findOne({ _id: new ObjectId(id) })
        if (!blog) {
            return null
        }
        return blogMapping(blog)
    }, //создание и добавление нового блога.
    async addNewBlog ( createdBlog: BlogDBModel ): Promise<BlogView> {
        const result = await BlogModelClass.create(createdBlog)

        return {
            id: result._id.toString(),
            name: createdBlog.name,
            description: createdBlog.description,
            websiteUrl: createdBlog.websiteUrl,
            createdAt: createdBlog.createdAt,
            isMembership: createdBlog.isMembership
        }
    }, //обновление блога по айди.
    async updateBlogById ( id: string, name: string, description: string, websiteUrl: string ): Promise<boolean> {
        const result = await BlogModelClass.updateOne({ _id: new ObjectId(id) },
            {
                $set: {
                    name,
                    description,
                    websiteUrl
                }
            })
        return result.matchedCount === 1
    }, //поиск блога по ID для удаления.
    async searchBlogByIdDelete ( id: string ): Promise<boolean> {
        const deleteResult = await BlogModelClass.deleteOne({ _id: new ObjectId(id) })
        return deleteResult.deletedCount === 1
    }
}
