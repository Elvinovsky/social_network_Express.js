import {blogsCollection, postsCollection} from "../../database/runDB";
import {blogViewModel} from "../../models/modelsBlogs/blogViewModel";
import {postViewModel} from "../../models/modelsPosts/postViewModel";



export const queryDbRepository = {

    //все существующие блоги.
    async returnOfAllBlogs(): Promise<blogViewModel[]> {
        return await blogsCollection.find({}, {projection:{ _id: 0 }}).toArray()
    } ,
    //поиск и возврат блога по ID.
    async findBlogById(id: string): Promise <blogViewModel | null> {
        return  await blogsCollection.findOne({id}, {projection:{ _id: 0 }})
    },
    async searchBlogIdForPost(blogId: string):Promise <postViewModel[] | null > {
        return  await postsCollection.find({id: blogId}).toArray()
    },
    async returnOfAllPosts(): Promise<postViewModel[]> {
        return await postsCollection.find({}, {projection:{ _id: 0 }}).toArray()
    },
    //поиск поста по ID.
    async findPostById(id: string): Promise <postViewModel | null> {
        return  await postsCollection.findOne({id}, {projection: {_id: 0}})
    },
}
