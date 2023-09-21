import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request  from "supertest";
import { app } from "../src/app";

let mongoServer: MongoMemoryServer;

describe('blogs',  () => {
    beforeAll(async ()=>{
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        await request(app).delete('/testing/all-data')
    })

    afterAll(async ()=>{
        await mongoose.disconnect();
        await mongoServer.stop();
    })

    it('GET BLOG BY ID NOT EXIST, should return 404 status', async ()=>{
        await request(app).get('/blogs/1').expect(404)
    })

    it('GET BLOGS 200, should return pagination model with empty array of items', async () => {
        await request(app).get('/blogs').expect(200, {
            "pagesCount": 0,
            "page": 1,
            "pageSize": 10,
            "totalCount": 0,
            "items": []
        })

    });

});