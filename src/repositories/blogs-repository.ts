import {db} from "../database/db";
import {blogViewModel} from "../models/modelsBlogs/blogViewModel";


export const blogsRepository = {
    //тестовое удаление базы данных о блогах.
    testingDeleteAllBlogs(): Array<null>{
        return db.allBlogs = []
    },
    //все существующие блоги.
    async returnOfAllBlogs(): Promise<blogViewModel[]> {
       return db.allBlogs
    } ,
    //создание и добавление нового блога.
    async addNewBlog(name: string, description: string, websiteUrl: string,): Promise <blogViewModel> {
        const createBlog: blogViewModel = {
            id:	(+(new Date())).toString(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        db.allBlogs.push(createBlog)
        return createBlog;
    },
    //поиск и возврат блога по ID.
    async findBlogById(id: string): Promise <blogViewModel | undefined> {
        return  db.allBlogs.find(el => el.id === id)
    },
    //обновление блога по айди.
    async updateBlogById(id: string, name: string, description: string, websiteUrl: string): Promise <boolean> {
        if (await this.findBlogById(id)) {
            db.allBlogs.forEach(el => {
                el.name = name
                el.description = description
                el.websiteUrl = websiteUrl
            })
            return true;
        }
        return false;
    },
    //поиск блога по ID для удаления.
    async searchBlogByIdDelete(id: string): Promise <boolean> {
        const index = db.allBlogs.findIndex(b => b.id === id)
        if (index > -1) {
            db.allBlogs.splice(index, 1)
            return true;
        }
        return false;
    }
}
