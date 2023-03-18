import {blogViewModel} from "../models/modelsBlogs/blogViewModel";
import {postViewModel} from "../models/modelsPosts/postViewModel";

export const db: {allBlogs:  blogViewModel[], allPosts: postViewModel[]} = {
    allBlogs: [{
        id:	"12",
        name: "IT",
        description: "разработка на JS",
        websiteUrl: "https://samurai.it-incubator.io/pc/video-content/watch/624db7c56667275d6a2cb2ef",
        createdAt: "2023-02-28T20:49:21.728Z",
        isMembership: false
    }],
    allPosts: [{
        id:	"1",
        title:	"Swagger",
        shortDescription: "сборка АПИ согласно документации.",
        content: "Предисловие",
        blogId:	'1',
        blogName: "IT",
        createdAt: "2023-02-28T20:49:21.728Z"
    }]
};
