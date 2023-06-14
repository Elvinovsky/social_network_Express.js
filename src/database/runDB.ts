import * as dotenv from 'dotenv'
import mongoose from "mongoose";

dotenv.config()

const dbName = 'home_works'
const mongoURI = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`

if (!mongoURI) {
    throw Error(`not found`)
}
console.log(process.env.MONGO_URL)

//export const client = new MongoClient(mongoURI)
//const db = client.db('lesson');

//export const blogsCollection = db.collection<BlogDBModel>('blogs');
//export const postsCollection = db.collection<PostDBModel>('posts');
//export const usersCollection = db.collection<UserAccountDBModel>('users');
//export const sessionsCollection = db.collection<SessionDBModel>('devices-sessions');
//export const feedbacksCollection = db.collection<CommentDBModel>('comments');
//export const attemptsCollection = db.collection<RequestAttempt>('attempts');

export async function runDb () {

    /*  try { //запуск монгодб
        await client.connect()
        await client.db()
                    .command({ ping: 1 })
        console.log('Connected to mongo server')
    } catch {
        await client.close()
        console.log('Not connect to mongo server')
    }
} */

    try {
        await mongoose.connect(mongoURI)
        console.log('it is ok')
    } catch (e) {
        console.log('no connection')
        await mongoose.disconnect()
    }
}