const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = 5000
const cors = require('cors');
require('dotenv').config();
// for get data
app.use(cors())
// for post dat
app.use(express.json())
// CakeDB10
// eKmtqzibCI8xFUdG



const uri = `mongodb+srv://${process.env.CAKE_DATABASE}:${process.env.CAKE_DB_PASS}@cluster0.h9wahhk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    const cakesCollection = client.db('allcakes').collection('cakes');
    const reviewCollection = client.db('allcakes').collection('reviews');
    try {
        app.get('/cakes', async (req, res) => {
            const query = {};
            const cursor = cakesCollection.find(query);
            const cakes = await cursor.limit(3).toArray();
            res.send(cakes)
        })
        app.get('/allcakes', async (req, res) => {
            const query = {};
            const cursor = cakesCollection.find(query);
            const cakes = await cursor.toArray();
            res.send(cakes)
        })
        app.get('/details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await cakesCollection.findOne(query);
            res.send(result)
        })
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        })
        app.get('/reviewlist', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review)
        })
        app.get('/myreview', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query)
            const review = await cursor.toArray();
            res.send(review)

        })
        app.delete('/details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result)
        })
    }
    catch {

    }
}
run().catch(console.error())









app.get('/', (req, res) => {
    res.send('cake server is running!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})