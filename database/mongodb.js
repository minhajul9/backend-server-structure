// this file is to connect with mongodb server

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wf4pdak.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function getDatabase() {
    try {
        await client.connect();
        return client.db("bloodbank");
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

module.exports = { getDatabase };
