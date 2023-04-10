export type PostInput = {
    /**
     * title input  model {maxLength: 30 }
     */
    title:	string,
    /**
     * shortDescription input model {maxLength: 100}
     */
    shortDescription: string,
    /**
     * content input model {maxLength: 1000}
     */
    content: string,
    /**
     * ID existing Blog {linked to a post}
     */
    blogId:	string,
}
export type BlogPostInputModel = {

    /**
     * title input  model {maxLength: 30 }
     */
    title:	string,
    /**
     * shortDescription input model {maxLength: 100}
     */
    shortDescription: string,
    /**
     * content input model {maxLength: 1000}
     */
    content: string,
}
export type PostDBModel = {//todo
    title:	string,
    shortDescription: string,
    content: string,
    blogId:	string,
    blogName: string,
    createdAt: string
}