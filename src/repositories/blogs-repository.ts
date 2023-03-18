import {db} from "../database/db";
import {blogViewModel} from "../models/modelsBlogs/blogViewModel";

export const blogsRepository = {
    //тестовое удаление базы данных о блогах.
    testingDeleteAllBlogs(): Array<null>{
        return db.allBlogs = []
    },
    //все существующие блоги.
    returnOfAllBlogs: db.allBlogs ,
    //создание и добавление нового блога.
    addNewBlog(name: string, description: string, websiteUrl: string,): blogViewModel{
        const createNewBlog: blogViewModel = {
            id:	(+(new Date())).toString(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        db.allBlogs.push(createNewBlog)
        return createNewBlog;
    },
    //поиск и возврат блога по ID.
    findBlogById(id: string): blogViewModel | undefined {
        return  db.allBlogs.find(el => el.id === id)
    },
    //обновление блога по айди.
    updateBlogById(id: string, name: string, description: string, websiteUrl: string): boolean {
        if(this.findBlogById(id)){
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
    searchBlogByIdDelete(id: string): boolean {
        const index = db.allBlogs.findIndex(b => b.id === id)
        if (index > -1) {
            db.allBlogs.splice(index, 1)
            return true;
        }
        return false;
    }
}
