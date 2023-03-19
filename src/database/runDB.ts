import dotenv from 'dotenv'
import {MongoClient} from "mongodb";
dotenv.config()

const mongoURI = process.env.MONGO_URI || "mongodb://0.0.0.0:27017";
console.log(process.env.MONGO_URI)

export const client = new MongoClient(mongoURI)
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