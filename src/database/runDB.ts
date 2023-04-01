import * as dotenv from 'dotenv'
import {MongoClient} from "mongodb";
import {BlogViewModel} from "../models/modelsBlogs/blogViewModel";
import {PostViewModel} from "../models/modelsPosts/postViewModel";
import {UserViewModel} from "../models/modelsUsers/usersInputModel";
dotenv.config()

const mongoURI = process.env.MONGO_URL;
// const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
if(!mongoURI) {
    throw Error (`not found`)
}
console.log(process.env.MONGO_URL)

export const client = new MongoClient(mongoURI)
const db = client.db('lesson');
export const blogsCollection = db.collection<BlogViewModel>('blogs');
export const postsCollection = db.collection<PostViewModel>('posts');
export const usersCollection = db.collection<UserViewModel>('users');
export async function runDb() {
    try {
        await client.connect()
        await client.db().command({ping: 1})
        console.log('Connected to mongo server')
    }
    catch {
        await client.close()
        console.log('Not connect to mongo server')
    }
}