import {PostViewModel} from "../models/modelsPosts/postViewModel";

export const postsMapping = (array: Array<PostViewModel>) =>{
    return array.map((el: PostViewModel) => {
      return {
          id: el.id,
          title: el.title,
          shortDescription: el.shortDescription,
          content: el.content,
          blogId: el.blogId,
          blogName: el.blogName,
          createdAt: el.createdAt
      }
    })
}