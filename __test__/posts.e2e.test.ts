import request from "supertest"
import { postsRouter } from "../src/routers/posts-router";
import { MongoClient } from "mongodb";

describe(`'mongodb integration`,
    () => {
        const mongoURI = 'mongodb://0.0.0.0:27017/home_works'
        const clientTest = new MongoClient(mongoURI)

        beforeAll(async() => {
            await clientTest.connect()
            await clientTest.db()
                            .command({ ping: 1 })
            console.log('Connected to mongo server')
        })


        it('/posts',
            async() => {
                await request(postsRouter)
                    .delete('/posts')
                    .expect(204)
            })

        it('GET allVideos = []',
            async() => {
                await request(postsRouter)
                    .get('/posts')
                    .expect(200,
                        [])
            })
        it('GET searchVideo 404 for not existing course',
            async() => {
                await request(postsRouter)
                    .get('/posts')
                    .expect(404)
            })
        it('- POST does not create the post with incorrect data',
            async() => {
                await request(postsRouter)
                    .post('/posts')
                    .send({
                        title: '',
                        author: ''
                    })
                    .expect(400,
                        {
                            errorsMessages: "errors",
                        })

                await request(postsRouter)
                    .get('/posts/')
                    .expect(200)
            })
        let createNewPost: any = null
        it('+ POST does created the video with correct data ( title, author)',
            async() => {

                const responseCreatePost = await request(postsRouter)
                    .post('/posts')
                    .send({
                        title: 'New Video',
                        shortDescription: 'shortDescription'
                    })
                    .expect(201)

                createNewPost = responseCreatePost.body

                expect(createNewPost)
                    .toEqual({
                        id: (+(new Date())).toString(),
                        title: createNewPost.title,
                        shortDescription: createNewPost.shortDescription,
                        content: createNewPost.content,
                        blogId: createNewPost.blogId,
                        blogName: createNewPost.outputBlogName,
                        createdAt: new Date().toISOString()
                    })
            })
        it('- GET videos by ID with incorrect id',
            async() => {
                await request(postsRouter)
                    .get('/posts' + -123)
                    .expect(404)
            })
        it('+ GET product by ID with correct id',
            async() => {
                await request(postsRouter)
                    .get('/posts/' + createNewPost.id)
                    .expect(200,
                        createNewPost)
            })
        it('- PUT product by ID with incorrect data',
            async() => {
                await request(postsRouter)
                    .put('/posts' + -1223)
                    .send({
                        title: 'title',
                        author: 'title'
                    })
                    .expect(404)

                const resGet = await request(postsRouter)
                    .get('/videos/')
                expect(resGet.body[0])
                    .toEqual(createNewPost)
            })
        it('+ PUT product by ID with correct data',
            async() => {
                await request(postsRouter)
                    .put('/posts/' + createNewPost.id)
                    .send({
                        title: 'hello title',
                        author: 'hello author',
                        publicationDate: '2023-01-12T08:12:39.261Z',
                    })
                    .expect(204)
            })
        it('- DELETE post by ID with incorrect id',
            async() => {
                await request(postsRouter)
                    .delete('/videos/' + -123)
                    .expect(404)
            })
        it('+ DELETE post by ID with correct id',
            async() => {
                await request(postsRouter)
                    .delete('/videos/' + createNewPost.id)
                    .expect(204)

                await request(postsRouter)
                    .get('/posts')
                    .expect(200,
                        [])
            })
        afterAll(async() => {
            await clientTest.close()
            console.log('Exit to mongo server')
        })
    })
