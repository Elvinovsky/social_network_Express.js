import {inMemory} from "../../database/in-memory";
import {PostViewModel} from "../../models/modelsPosts/postViewModel";
import {BlogViewModel} from "../../models/modelsBlogs/blogViewModel";
export const postsRepository = {
    // тестовое удаление базы данных Постов
    async testingDeleteAllPosts() {
       return inMemory.allPosts = []
    },
    // все существующие посты.
    async returnOfAllPosts(): Promise<PostViewModel[]> {
       return inMemory.allPosts;
    },
    //создание и добавление нового поста в базу данных.
    async addNewPost(title: string, shortDescription: string, content: string, blogId: string): Promise <PostViewModel> {
        const outputBlogName: string = this.findBlogIdForPost.name
        const createNewPost: PostViewModel = {
            id: (+(new Date())).toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId:	blogId,
            blogName: outputBlogName,
            createdAt: new Date().toISOString()
        }
        inMemory.allPosts.push(createNewPost)
        return createNewPost;
    },
    //поиск поста по ID.
    async findPostById(id: string): Promise <PostViewModel | undefined> {
        return  inMemory.allPosts.find(el => el.id === id)
    },
    // обновление поста по ID.
    async updatePostById(id: string, title: string, shortDescription: string, content: string): Promise <boolean> {
        if(await this.findPostById(id)){
            inMemory.allPosts.forEach(el => {
                el.title = title
                el.shortDescription = shortDescription
                el.content = content
            })
            return true;
        }
        return false;
    },
    //поиск ID блога для поста.
    async findBlogIdForPost(blogId: string):Promise <BlogViewModel | undefined> {
        const blogIdForPost = await inMemory.allBlogs.find(el => el.id === blogId)
        if(blogIdForPost) {
            return blogIdForPost
        } else {
            return undefined;
        }
    },
    // поиск и удаление поста по ID.
    async postByIdDelete(id: string):Promise <boolean> {
        const index = inMemory.allBlogs.findIndex(b => b.id === id)
        if (index > -1) {
            inMemory.allBlogs.splice(index, 1)
            return true;
        }
        return false;
    }
}