import {blogsCollection} from "../../database/runDB";
import {blogViewModel} from "../../models/modelsBlogs/blogViewModel";
import {DeleteResult} from "mongodb";

export const blogsRepository = {
    //тестовое удаление базы данных о блогах.
    async testingDeleteAllBlogs(): Promise<DeleteResult>{
       return await blogsCollection.deleteMany({})
    },
    //все существующие блоги.
    async returnOfAllBlogs(): Promise<blogViewModel[]> {
       return await blogsCollection.find({}, {projection:{ _id: 0 }}).toArray()
    } ,
    //поиск и возврат блога по ID.
    async findBlogById(id: string): Promise <blogViewModel | null> {
        return  await blogsCollection.findOne({id}, {projection:{ _id: 0 }})
    },
    //создание и добавление нового блога.
    async addNewBlog(createBlog: blogViewModel): Promise <blogViewModel> {
        await blogsCollection.insertOne(createBlog)
        return {
            id: createBlog.id,
            name: createBlog.name,
            description: createBlog.description,
            websiteUrl: createBlog.websiteUrl,
            createdAt: createBlog.createdAt,
            isMembership: createBlog.isMembership
        }
    },
    //обновление блога по айди.
    async updateBlogById(id: string, name: string, description: string, websiteUrl: string): Promise <boolean> {
        const result = await blogsCollection.updateOne({id}, {$set: {name, description, websiteUrl}})
      return result.matchedCount === 1
     },
    //поиск блога по ID для удаления.
    async searchBlogByIdDelete(id: string): Promise <boolean> {
        const deleteResult = await blogsCollection.deleteOne({id})
        return deleteResult.deletedCount === 1
    }
}
