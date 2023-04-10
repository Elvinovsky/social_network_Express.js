import {PostView} from "../models/modelsPosts/post-view";
import {WithId} from "mongodb";
import {PostDBModel} from "../models/modelsPosts/post-input";

export const postsMapping = (array: Array<WithId<PostDBModel>>): PostView[] =>{
    return array.map((el) => {
      return {
          id: el._id.toString(),
          title: el.title,
          shortDescription: el.shortDescription,
          content: el.content,
          blogId: el.blogId,
          blogName: el.blogName,
          createdAt: el.createdAt
      }
    })
}
export const postMapping = ((post: WithId<PostDBModel>) => {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    })