import {blogsRepository} from "../repositories/db/blogs-db-repository";
import {blogViewModel} from "../models/modelsBlogs/blogViewModel";


export const blogsService = {
    async CreateBlog(name: string, description: string, websiteUrl: string,): Promise <blogViewModel> {

        const createBlog: blogViewModel = {
            id: (+(new Date())).toString(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return await blogsRepository.addNewBlog(createBlog)
    },
    async updateBlogById(id: string, name: string, description: string, websiteUrl: string): Promise <boolean> {
       return blogsRepository.updateBlogById(id, name, description, websiteUrl)
    },
    async BlogByIdDelete(id: string): Promise <boolean> {
        return blogsRepository.searchBlogByIdDelete(id)
    }
}
