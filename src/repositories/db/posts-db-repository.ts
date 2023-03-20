import {client} from "../../database/runDB";
import {postViewModel} from "../../models/modelsPosts/postViewModel";
import {blogViewModel} from "../../models/modelsBlogs/blogViewModel";


export const postsRepository = {
    // тестовое удаление базы данных Постов
    async testingDeleteAllPosts() {
        return await client.db('db').collection('posts').deleteMany()
    },
    // все существующие посты.
    async returnOfAllPosts(): Promise<postViewModel[]> {
        return await client.db('db').collection<postViewModel>('posts').find({}, {projection:{ _id: 0 }}).toArray()
    },
    //создание и добавление нового поста в базу данных.
    async addNewPost(title: string, shortDescription: string, content: string, blogId: string): Promise <postViewModel> {
        const outputBlogName: string = this.searchBlogIdForPost.name
        const createPost: postViewModel = {
            id: (+(new Date())).toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId:	blogId,
            blogName: outputBlogName,
            createdAt: new Date().toISOString()
        }
        await client.db('db').collection<postViewModel>('posts').insertOne(createPost)
        return {
            id: createPost.id,
            title: createPost.title,
            shortDescription: createPost.shortDescription,
            content: createPost.content,
            blogId:	createPost.blogId,
            blogName: createPost.blogName,
            createdAt: createPost.createdAt
        }
    },
    //поиск поста по ID.
    async findPostById(id: string): Promise <postViewModel | undefined> {
       const post = await client.db('db').collection<postViewModel>('posts').findOne({id},{projection:{ _id: 0 }})
        if (post) {
            return post;
        } else {
            return undefined;
        }
    },
    // обновление поста по ID.
    async updatePostById(id: string, title: string, shortDescription: string, content: string,): Promise <boolean> {
       const updateResult = await client.db('db').collection<postViewModel>('posts').updateOne({id}, {$set: {title, shortDescription, content}})
        return updateResult.matchedCount === 1;
    },
    //поиск ID блога для поста.
    async searchBlogIdForPost(blogId: string):Promise <blogViewModel | undefined> {
        const blogIdForPost = await client.db('db').collection<blogViewModel>('blogs').findOne({id: blogId})
        if(blogIdForPost) {
            return blogIdForPost
        } else {
            return undefined;
        }
    },
    // поиск и удаление поста по ID.
    async PostByIdDelete(id: string):Promise <boolean> {
        const deleteResult = await client.db('db').collection<blogViewModel>('posts').deleteOne({id})
        return deleteResult.deletedCount === 1
    }
}