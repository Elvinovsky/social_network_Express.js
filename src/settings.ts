export const settings = {//todo refactoring
    MONGO_URI: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    JWT_SECRET: process.env.JWT_SECRET || '123'
}
