import * as dotenv from 'dotenv'
import { MongoClient } from "mongodb";
import { UserAccountDBModel } from "../models/modelsUsersLogin/user-input";
import { BlogDBModel } from "../models/modelsBlogs/blog-input";
import { CommentDBModel } from "../models/modelsComment/comment-input";
import { PostDBModel } from "../models/modelsPosts/post-input";
import { DeviceAuthSessionsDBModel } from "../models/modelsDevice/device-input";
import { RequestAttempt } from "../middlewares/rateLimiter";

dotenv.config()

const mongoURI = process.env.MONGO_URL;
// const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
if (!mongoURI) {
    throw Error(`not found`)
}
console.log(process.env.MONGO_URL)

export const client = new MongoClient(mongoURI)
const db = client.db('lesson');
export const blogsCollection = db.collection<BlogDBModel>('blogs');
export const postsCollection = db.collection<PostDBModel>('posts');
export const usersCollection = db.collection<UserAccountDBModel>('users');
export const sessionsCollection = db.collection<DeviceAuthSessionsDBModel>('devices-sessions');
export const feedbacksCollection = db.collection<CommentDBModel>('comments');
export const attemptsCollection = db.collection<RequestAttempt>('attempts');
export async function runDb () {
    try {
        await client.connect()
        await client.db()
                    .command({ ping: 1 })
        console.log('Connected to mongo server')
    } catch {
        await client.close()
        console.log('Not connect to mongo server')
    }
}