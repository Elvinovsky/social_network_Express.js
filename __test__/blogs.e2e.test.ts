import request from "supertest";
import { app } from "../src/app";
import { runDb } from "../src/database/runDB";
import mongoose from "mongoose";


export const blogCreator = async( uri = "/blogs", name = "Test name", description = "Test description", websiteUrl = "https://someurl.com/test", authValue = "Basic YWRtaW46cXdlcnR5" ) => {
    return request(app)
        .post(uri)
        .send({
            uri,
            name,
            description,
            websiteUrl,
        })
        .set({ Authorization: authValue });
};

export const blogFilterString01 = "лимон";
export const blogFilterString02 = "банан";
export const blogFilterString03 = "ананас";
export const blogFilterString04 = "дыня";
export const blogFilterString05 = "арбуз";
//TEST BLOGS
describe('Mongoose integration',
    () => {
        const mongoURI = 'mongodb://0.0.0.0:27017/home_works'

        beforeAll(async() => {
            /* Connecting to the database. */
            await mongoose.connect(mongoURI)
        })

        afterAll(async() => {
            /* Closing database connection after each test. */
            await mongoose.connection.close()
        })
        describe('blogs',
            () => {
                //DELETE ALL DATA
                beforeAll(async() => {
                    runDb()
                    await request(app)
                        .delete('/testing/all-data')
                })
                //CHECK FOR EMPTY BLOG DATA BASE
                it('GET EMPTY BLOG DATA BASE',
                    async() => {
                        const res = await request(app)
                            .get('/blogs')
                        expect(res.body)
                            .toStrictEqual({
                                pagesCount: 0,
                                page: 1,
                                pageSize: 10,
                                totalCount: 0,
                                items: []
                            })
                    })

                let createResponseBlog: any

                //CREATE NEW BLOG

                it('SUCCESSFULLY CREATE NEW BLOG',
                    async() => {
                        createResponseBlog = await request(app)
                            .post('/blogs')
                            .send({
                                "name": "ELV",
                                "description": "about me",
                                "websiteUrl": "http://www.Elvinovsky.com"
                            })
                            .set({ Authorization: "Basic YWRtaW46cXdlcnR5" })
                            .expect(201)
                    })

                //GET CREATED BLOG

                it('GET SUCCESSFULLY CREATED BLOG',
                    async() => {
                        const blog = await request(app)
                            .get("/blogs/" + createResponseBlog.body.id)
                        expect(blog.body)
                            .toStrictEqual({
                                "id": expect.any(String),
                                "name": "Nastya",
                                "description": "about me",
                                "websiteUrl": "http://www.nastyastar.com",
                                "createdAt": expect.any(String),
                                "isMembership": false
                            })
                    })

                //PUT CREATED BLOG

                it('SUCCESSFULLY UPDATE CREATED BLOG',
                    async() => {
                        request(app)
                            .put("/blogs/" + createResponseBlog.body.id)
                            .send({
                                name: "Not Nastya",
                                description: "Not about me",
                                websiteUrl: "http://www.nastyakoshka.com",
                            })
                            .set({ Authorization: "Basic YWRtaW46cXdlcnR5" })
                            .expect(200)
                    })

                //CHECK FOR UPDATED BLOG

                it('SUCCESSFULLY UPDATED BLOG',
                    async() => {
                        const blog = await request(app)
                            .get("/blogs/" + createResponseBlog.body.id)
                            .expect(200)
                        expect(blog.body)
                            .toStrictEqual({
                                "id": createResponseBlog.body.id,
                                "name": "Not Nastya",
                                "description": "Not about me",
                                "websiteUrl": "http://www.nastyakoshka.com",
                                "createdAt": expect.any(String),
                                "isMembership": false
                            })
                    })

                //CREATE NEW POST

                it('SUCCESSFULLY CREATE NEW POST BY BLOG ID',
                    async() => {
                        await request(app)
                            .post('/blogs/' + createResponseBlog.body.id + '/posts')
                            .send({
                                "title": "Black Sea",
                                "shortDescription": "about sea",
                                "content": "black sea is hot"
                            })
                            .set({ Authorization: "Basic YWRtaW46cXdlcnR5" })
                            .expect(201)
                    })

                //GET POSTS WITH PAGINATION

                it('GET POSTS BY BLOG ID WITH PAGINATION',
                    async() => {
                        const posts = await request(app)
                            .get('/blogs/' + createResponseBlog.body.id + '/posts')
                        expect(posts.body)
                            .toStrictEqual({
                                pagesCount: 1,
                                page: 1,
                                pageSize: 10,
                                totalCount: 1,
                                items: [{
                                    "title": "Black Sea",
                                    "shortDescription": "about sea",
                                    "content": "black sea is hot",
                                    "createdAt": expect.any(String),
                                    "blogId": createResponseBlog.body.id,
                                    "blogName": "ELV",
                                    "id": expect.any(String)
                                }]
                            })
                    })

                //DELETE CREATED BLOG WITH NO AUTH

                it('UNSUCCESSFULLY DELETE CREATED BLOG',
                    async() => {
                        await request(app)
                            .delete("/blogs/" + createResponseBlog.body.id)
                            .expect(401)
                    })

                //DELETE NOT EXISTING BLOG

                it('UNSUCCESSFULLY DELETE NOT EXISTING BLOG',
                    async() => {
                        await request(app)
                            .delete("/blogs/gslgl1323gd")
                            .set({ Authorization: "Basic YWRtaW46cXdlcnR5" })
                            .expect(404)
                    })

                //SUCCESSFULLY DELETE CREATED BLOG

                it('SUCCESSFULLY DELETE CREATED BLOG',
                    async() => {
                        await request(app)
                            .delete("/blogs/" + createResponseBlog.body.id)
                            .set({ Authorization: "Basic YWRtaW46cXdlcnR5" })
                            .expect(204)
                    })

                //CREATE 5 NEW BLOGS

                it("SUCCESSFULLY CREATE 5 BLOGS",
                    async() => {
                        await blogCreator(undefined,
                            blogFilterString01);
                        await blogCreator(undefined,
                            blogFilterString02);
                        await blogCreator(undefined,
                            blogFilterString03);
                        await blogCreator(undefined,
                            blogFilterString04);
                        const lastBlogResponse = await blogCreator(undefined,
                            blogFilterString05);
                        expect(lastBlogResponse.status)
                            .toBe(201);
                    })

                //CHECK BLOGS WITH SEARCH NAME TERM

                it("CHECK BLOGS FOR PAGINATION WITH SEARCH NAME TERM",
                    async() => {
                        const blog = await request(app)
                            .get("/blogs?searchNameTerm=Citronner")
                        expect(blog.body.items[0].name)
                            .toEqual("Citronner")
                    })

                //CHECK BLOGS WITH SORT BY NAME

                it("CHECK BLOGS FOR PAGINATION WITH SORT BY NAME",
                    async() => {
                        const blog = await request(app)
                            .get("/blogs?sortBy=name&sortDirection=asc&pageSize=5&searchNameTerm=ana")
                        expect(blog.body)
                            .toStrictEqual({
                                pagesCount: 1,
                                page: 1,
                                pageSize: 5,
                                totalCount: 3,
                                items: [{
                                    "id": expect.any(String),
                                    "name": "Ananas",
                                    "description": expect.any(String),
                                    "websiteUrl": expect.any(String),
                                    "createdAt": expect.any(String),
                                    "isMembership": false
                                }, {
                                    "id": expect.any(String),
                                    "name": "Banana",
                                    "description": expect.any(String),
                                    "websiteUrl": expect.any(String),
                                    "createdAt": expect.any(String),
                                    "isMembership": false
                                }, {
                                    "id": expect.any(String),
                                    "name": "Danam",
                                    "description": expect.any(String),
                                    "websiteUrl": expect.any(String),
                                    "createdAt": expect.any(String),
                                    "isMembership": false
                                }]
                            })
                    })

                afterAll(async() => {
                    await request(app)
                        .delete('/testing/all-data')
                        .set({ Authorization: "Basic YWRtaW46cXdlcnR5" })
                        .expect(204)

                })

            })

    })