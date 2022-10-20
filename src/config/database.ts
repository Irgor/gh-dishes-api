const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_DATABASE = process.env.MONGO_DATABASE || '';
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.xdf8tzb.mongodb.net/${MONGO_DATABASE}?retryWrites=true&w=majority`
export const databaseConfig = {
    url: MONGO_URL
}