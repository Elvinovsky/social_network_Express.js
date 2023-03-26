import {blogsRepository} from "../repositories/db/blogs-db-repository";
import {BlogViewModel} from "../models/modelsBlogs/blogViewModel";


export const blogsService = {
    async findBlogById(id: string): Promise <BlogViewModel | null> {
        return blogsRepository.findBlogById(id)
    },
    async createBlog(name: string, description: string, websiteUrl: string,): Promise <BlogViewModel> {

        const createBlog: BlogViewModel = {
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
