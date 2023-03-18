"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const db_1 = require("../database/db");
exports.blogsRepository = {
    //тестовое удаление базы данных о блогах.
    testingDeleteAllBlogs() {
        return db_1.db.allBlogs = [];
    },
    //все существующие блоги.
    returnOfAllBlogs: db_1.db.allBlogs,
    //создание и добавление нового блога.
    addNewBlog(name, description, websiteUrl) {
        const createNewBlog = {
            id: (+(new Date())).toString(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        db_1.db.allBlogs.push(createNewBlog);
        return createNewBlog;
    },
    //поиск и возврат блога по ID.
    findBlogById(id) {
        return db_1.db.allBlogs.find(el => el.id === id);
    },
    //обновление блога по айди.
    updateBlogById(id, name, description, websiteUrl) {
        if (this.findBlogById(id)) {
            db_1.db.allBlogs.forEach(el => {
                el.name = name;
                el.description = description;
                el.websiteUrl = websiteUrl;
            });
            return true;
        }
        return false;
    },
    //поиск блога по ID для удаления.
    searchBlogByIdDelete(id) {
        const index = db_1.db.allBlogs.findIndex(b => b.id === id);
        if (index > -1) {
            db_1.db.allBlogs.splice(index, 1);
            return true;
        }
        return false;
    }
};
