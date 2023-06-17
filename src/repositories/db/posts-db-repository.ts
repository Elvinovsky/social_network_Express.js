import { PostView } from "../../models/modelsPosts/post-view";
import {
    DeleteResult,
    ObjectId,
    WithId
} from "mongodb";
import { BlogDBModel } from "../../models/modelsBlogs/blog-input";
import { PostDBModel } from "../../models/modelsPosts/post-input";
import { postMapping } from "../../functions/postsMapping";
import {
    BlogModelClass,
    PostModelClass
} from "../../models/mongoose/models";

export const postsRepository = {
    // тестовое удаление базы данных Постов
    async testingDeleteAllPosts (): Promise<DeleteResult> {
        return PostModelClass.deleteMany({})
    }, //поиск поста по ID.
    async findPostById ( id: string, userId?: string ): Promise<PostView | null> {
        const post = await PostModelClass.findOne({ _id: new ObjectId(id) })
        if (!post) {
            return null
        }
        return postMapping(post,
            userId)
    }, //создание и добавление нового поста в базу данных.
    async addNewPost ( post: PostDBModel ): Promise<PostView> {
        const newPost = new PostModelClass(post)
        await newPost.save()
        return postMapping(newPost)
    }, // обновление поста по ID.
    async updatePostById ( id: string, title: string, shortDescription: string, content: string, ): Promise<boolean> {
        const updateResult = await PostModelClass.updateOne({ _id: new ObjectId(id) },
            {
                $set: {
                    title,
                    shortDescription,
                    content
                }
            })
        return updateResult.matchedCount === 1;
    }, //поиск ID блога для поста.5
    async findBlogIdForPost ( blogId: string ): Promise<WithId<BlogDBModel> | null> {
        const blogIdForPost = await BlogModelClass.findOne({ _id: new ObjectId(blogId) })
        return blogIdForPost ? blogIdForPost : null
    }, // поиск и удаление поста по ID.
    async postByIdDelete ( id: string ): Promise<boolean> {
        const deleteResult = await PostModelClass.deleteOne({ _id: new ObjectId(id) })
        return deleteResult.deletedCount === 1
    }
}