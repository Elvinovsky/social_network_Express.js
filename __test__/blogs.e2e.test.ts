import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from "supertest";
import { app } from "../src/app";

let mongoServer: MongoMemoryServer;

describe('blogs',
    () => {
        beforeAll(async() => {
            mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            await mongoose.connect(mongoUri);
            await request(app)
                .delete('/testing/all-data')
        })

        afterAll(async() => {
            await mongoose.disconnect();
            await mongoServer.stop();
        })

        it('GET BLOG BY ID NOT EXIST, should return 404 status',
            async() => {
                await request(app)
                    .get('/blogs/1')
                    .expect(404)
            })

        it('GET BLOGS, should return pagination model with empty array of items',
            async() => {
                await request(app)
                    .get('/blogs')
                    .expect(200,
                        {
                            "pagesCount": 0,
                            "page": 1,
                            "pageSize": 10,
                            "totalCount": 0,
                            "items": []
                        })

            });

        it('CREATE BLOG INVALID BODY, should return 400 and errorsMessages array',
            async() => {
                await request(app)
                    .post('/blogs')
                    .set({ authorization: 'Basic YWRtaW46cXdlcnR5' })
                    .send({
                        "name": "ti",
                        "description": "de",
                        "websiteUrl": "invalid"
                    })
                    .expect(400,
                        {
                            "errorsMessages": [{
                                "message": "length should be no more than 15 characters",
                                "field": "name"
                            }, {
                                "message": "is not a link to the site",
                                "field": "websiteUrl"
                            }, {
                                "message": "length should be no more than 500 characters",
                                "field": "description"
                            }]
                        })
            })

        it('GET BLOGS, should return pagination model with empty array of items',
            async() => {
                await request(app)
                    .get('/blogs')
                    .expect(200,
                        {
                            "pagesCount": 0,
                            "page": 1,
                            "pageSize": 10,
                            "totalCount": 0,
                            "items": []
                        })

            });

        it('CREATE BLOG without authorization, should  return 401 status',
            async() => {
                await request(app)
                    .post('/blogs')
                    .send({
                        "name": "name valid",
                        "description": "description valid",
                        "websiteUrl": "https://someurl.com"
                    })
                    .expect(401)
            })

        let createBlog: any;

        it('CREATE BLOG, should return 201 and blogViewModel',
            async() => {
                createBlog = await request(app)
                    .post('/blogs')
                    .set({ authorization: 'Basic YWRtaW46cXdlcnR5' })
                    .send({
                        "name": "timm",
                        "description": "description valid",
                        "websiteUrl": "https://someurl.com"
                    })
                    .expect(201)

                expect(createBlog.body)
                    .toEqual({
                        id: createBlog.body.id,
                        name: createBlog.body.name,
                        description: createBlog.body.description,
                        websiteUrl: createBlog.body.websiteUrl,
                        createdAt: createBlog.body.createdAt,
                        isMembership: false
                    })

                const getCreatedBlog = await request(app)
                    .get('/blogs/' + createBlog.body.id)
                    .expect(200)

                expect(getCreatedBlog.body)
                    .toEqual(createBlog.body)
            })

        it('UPDATE BLOG BY ID, should return 401',
            async() => {
                const getBlog = await request(app)
                    .put('/blogs/' + createBlog.body.id)
                    .send({
                        "name": "timm updated",
                        "description": "description updated",
                        "websiteUrl": "https://someurl.com"
                    })
                    .expect(401)
            })

        it('UPDATE BLOG BY ID, should return 404',
            async() => {
                const getBlog = await request(app)
                    .put('/blogs/' + 1)
                    .set({ authorization: 'Basic YWRtaW46cXdlcnR5' })
                    .send({
                        "name": "timm updated",
                        "description": "description updated",
                        "websiteUrl": "https://someurl.com"
                    })
                    .expect(404)
            })

        it('UPDATE BLOG BY ID, should updated Blog',
            async() => {
                const updateBlog = await request(app)
                    .put('/blogs/' + createBlog.body.id)
                    .set({ authorization: 'Basic YWRtaW46cXdlcnR5' })
                    .send({
                        "name": "timm updated",
                        "description": "description updated",
                        "websiteUrl": "https://someurl.com"
                    })
                    .expect(204)

                const getUpdatedBlog = await request(app)
                    .get('/blogs/' + createBlog.body.id)
                    .expect(200)

                expect({
                    "name": "timm updated",
                    "description": "description updated",
                    "websiteUrl": "https://someurl.com"
                })
                    .toEqual({
                        "name": getUpdatedBlog.body.name,
                        "description": getUpdatedBlog.body.description,
                        "websiteUrl": getUpdatedBlog.body.websiteUrl
                    })
            })

    });