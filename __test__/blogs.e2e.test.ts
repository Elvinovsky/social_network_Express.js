import request from 'supertest';
import { MongoClient, Db, Collection } from 'mongodb';
import { blogsRouter } from '../src/routers/blogs-router';

describe('mongodb integration', () => {
    let connection: MongoClient;
    let db: Db;
    let blogsCollection: Collection;
    let postsCollection: Collection;
    let blog: any;
    beforeAll(async () => {
        connection = await MongoClient.connect("mongodb+srv://elvinovsky:Hbe0eJpHGkd0ss8L@cluster0.tw8beem.mongodb.net/?retryWrites=true&w=majority", {
            // @ts-ignore
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = await connection.db("test");
    });

    afterAll(async () => {
        await connection.close();
    });

    beforeEach(async () => {
        await blogsCollection.deleteMany({});
        await postsCollection.deleteMany({});

        // Присвойте переменной blog допустимое значение
        const insertedBlog = await blogsCollection.insertOne({
            // Вставьте свойства объекта blog здесь
            // Например:
            name: 'Тестовый блог',
            description: 'Описание тестового блога',
            websiteUrl: 'https://example.com',
        });
        blog = { insertedId: insertedBlog.insertedId.toString() };
    });

    it('should return all blogs', async () => {
        const response = await request(blogsRouter).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.any(Array));
    });

    it('should return a specific blog by ID', async () => {
        let response;
        response = await request(blogsRouter).get(`/${blog.insertedId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.any(Object));
    });

    it('should return posts of a specific blog', async () => {
        let response;
        response = await request(blogsRouter).get(`/${blog.insertedId}/posts`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.any(Array));
    });

    it('should create a new post for a specific blog', async () => {
        const response = await request(blogsRouter)
            .post(`/${blog.insertedId}/posts`)
            .send({
                title: 'New Post',
                shortDescription: 'Short description',
                content: 'Post content',
            });
        expect(response.status).toBe(201);
        expect(response.body).toEqual(expect.any(Object));
    });

    it('should create a new blog', async () => {
        const response = await request(blogsRouter)
            .post('/')
            .send({
                name: 'New Blog',
                description: 'Blog description',
                websiteUrl: 'https://example.com',
            });
        expect(response.status).toBe(201);
        expect(response.body).toEqual(expect.any(Object));
    });

    it('should update a specific blog', async () => {
        const response = await request(blogsRouter)
            .put(`/${blog.insertedId}`)
            .send({
                name: 'Updated Blog',
                description: 'Updated description',
                websiteUrl: 'https://example.com',
            });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.any(Object));
    });

    it('should delete a specific blog', async () => {
        let response;
        response = await request(blogsRouter).delete(`/${blog.insertedId}`);
        expect(response.status).toBe(204);
    });

})