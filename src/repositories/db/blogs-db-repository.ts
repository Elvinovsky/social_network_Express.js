import {client} from "../../database/runDB";
import {blogViewModel} from "../../models/modelsBlogs/blogViewModel";
import {blogInputModel} from "../../models/modelsBlogs/blogInputModel";

export const blogsRepository = {
    //тестовое удаление базы данных о блогах.
    async testingDeleteAllBlogs(){
       return await client.db('db').collection<blogViewModel[]>('blogs').deleteMany({})
    },
    //все существующие блоги.
    async returnOfAllBlogs(): Promise<blogViewModel[]> {
       return await client.db('db').collection<blogViewModel>('blogs').find({}, {projection:{ _id: 0 }}).toArray()
    } ,
    //создание и добавление нового блога.
    async addNewBlog(name: string, description: string, websiteUrl: string,): Promise <blogViewModel> {

        const createBlog: blogViewModel = {
            id: (+(new Date())).toString(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        await client.db('db').collection<blogViewModel>('blogs').insertOne(createBlog)
        return {
            id: createBlog.id,
            name: createBlog.name,
            description: createBlog.description,
            websiteUrl: createBlog.websiteUrl,
            createdAt: createBlog.createdAt,
            isMembership: createBlog.isMembership
        }
    },
    //поиск и возврат блога по ID.
    async findBlogById(id: string): Promise <blogViewModel | undefined> {
        const blog: blogViewModel | null = await client.db('db').collection<blogViewModel>('blogs').findOne({id}, {projection:{ _id: 0 }})
        if (blog) {
            return blog;
        } else {
            return undefined;
        }
    },
    //обновление блога по айди.
    async updateBlogById(id: string, name: string, description: string, websiteUrl: string): Promise <boolean> {
        const result = await client.db('db').collection<blogInputModel>('blogs').updateOne({id}, {$set: {name, description, websiteUrl}})
      return result.matchedCount === 1
     },
    //поиск блога по ID для удаления.
    async searchBlogByIdDelete(id: string): Promise <boolean> {
        const deleteResult = await client.db('db').collection<blogViewModel>('blogs').deleteOne({id})
        return deleteResult.deletedCount === 1
    }
}
