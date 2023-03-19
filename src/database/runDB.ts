import * as dotenv from 'dotenv'
import {MongoClient} from "mongodb";
dotenv.config()

const mongoURI = process.env.MONGO_URL;
if(!mongoURI) {
    throw Error ('Don-don')
}
console.log(process.env.MONGO_URL)

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