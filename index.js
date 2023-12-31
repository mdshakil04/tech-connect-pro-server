const express = require('express');
const cors = require('cors');

require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l8rzo73.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const productCollection = client.db('productDB').collection('product');

    app.get('/product', async(req, res) =>{
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/product', async(req, res)=>{
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



//Home Route setup
app.get('/', (req,res)=>{
    res.send('TechConnect Pro Server is Running')
})

app.listen(port, ()=>{
    console.log(`TechConnect Pro Server is Running on port : ${port}`)
})
