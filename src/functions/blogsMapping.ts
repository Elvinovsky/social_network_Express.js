import { BlogView } from "../models/modelsBlogs/blog-view";
import { WithId } from 'mongodb'
import { BlogDBModel } from "../models/modelsBlogs/blog-input";

export const blogsMapping = ( array: Array<WithId<BlogDBModel>> ): BlogView[] => {
    return array.map(( el ) => {
        return {
            id: el._id.toString(),
            name: el.name,
            description: el.description,
            websiteUrl: el.websiteUrl,
            createdAt: el.createdAt,
            isMembership: el.isMembership
        }
    })
}
export const blogMapping = ( blog: WithId<BlogDBModel> ): BlogView => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}
