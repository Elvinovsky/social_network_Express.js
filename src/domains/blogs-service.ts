import {blogsRepository} from "../repositories/db/blogs-db-repository";
import {BlogView} from "../models/modelsBlogs/blog-view";
import {BlogDBModel} from "../models/modelsBlogs/blog-input";




export const blogsService = {
    async findBlogById(id: string): Promise <BlogView | null> {

        return blogsRepository.findBlogById(id)
    },
    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogView> {

        const createdBlog: BlogDBModel = {
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return await blogsRepository.addNewBlog(createdBlog)
    },
    async updateBlogById(id: string, name: string, description: string, websiteUrl: string): Promise <boolean> {
       return blogsRepository.updateBlogById(id, name, description, websiteUrl)
    },
    async BlogByIdDelete(id: string): Promise <boolean> {
        return blogsRepository.searchBlogByIdDelete(id)
    }
}
