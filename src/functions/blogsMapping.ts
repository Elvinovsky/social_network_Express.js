import {BlogDBModel, BlogViewModel} from "../models/modelsBlogs/blogViewModel";
import {WithId} from 'mongodb'

export const blogsMapping = (array: Array<WithId<BlogDBModel>>): BlogViewModel[] =>{
    return array.map((el) => {
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