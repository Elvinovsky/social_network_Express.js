import {db} from "../database/db";
import {postViewModel} from "../models/modelsPosts/postViewModel";
import {blogViewModel} from "../models/modelsBlogs/blogViewModel";
export const postsRepository = {
    // тестовое удаление базы данных Постов
    testingDeleteAllPosts(): Array<null>{
       return db.allPosts = []
    },
    // все существующие посты.
    returnOfAllPosts: db.allPosts,
    //создание и добавление нового поста в базу данных.
    addNewPost(title: string, shortDescription: string, content: string, blogId: string): postViewModel {
        const outputBlogName: string = this.searchBlogIdForPost(blogId)!.name
        const createNewPost: postViewModel = {
            id: (+(new Date())).toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId:	blogId,
            blogName: outputBlogName,
            createdAt: new Date().toISOString()
        }
        db.allPosts.push(createNewPost)
        return createNewPost;
    },
    //поиск поста по ID.
    findPostById(id: string): postViewModel | undefined {
        return  db.allPosts.find(el => el.id === id)
    },
    // обновление поста по ID.
    updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string): boolean {
        if(this.findPostById(id)){
            db.allPosts.forEach(el => {
                el.title = title
                el.shortDescription = shortDescription
                el.content = content
                el.blogId = blogId
            })
            return true;
        }
        return false;
    },
    //поиск ID блога для поста.
    searchBlogIdForPost(blogId: string):blogViewModel | undefined {
        return db.allBlogs.find(el => el.id === blogId)
    },
    // поиск и удаление поста по ID.
    searchForPostByIdDelete(id: string): boolean {
        const index = db.allBlogs.findIndex(b => b.id === id)
        if (index > -1) {
            db.allBlogs.splice(index, 1)
            return true;
        }
        return false;
    }
}