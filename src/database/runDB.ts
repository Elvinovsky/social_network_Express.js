import * as dotenv from 'dotenv'
import {MongoClient} from "mongodb";
import {blogViewModel} from "../models/modelsBlogs/blogViewModel";
import {postViewModel} from "../models/modelsPosts/postViewModel";

dotenv.config()

const mongoURI = process.env.MONGO_URL;
if(!mongoURI) {
    throw Error (`not found`)
}
console.log(process.env.MONGO_URL)

export const client = new MongoClient(mongoURI)
const db = client.db('lesson');
export const blogsCollection = db.collection<blogViewModel>('blogs');
export const postsCollection = db.collection<postViewModel>('posts');
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