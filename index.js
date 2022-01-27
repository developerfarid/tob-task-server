const express = require('express')
const app = express()
const cors = require("cors")
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000
require("dotenv").config();

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.doqsn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);


async function run() {
  try {
    await client.connect();
    const database = client.db('tour');
    const productCollection = database.collection('post');
    const addPostCollection = database.collection('addPost');
    const userCollection = database.collection('user');
    const ollection = database.collection('booking');





    app.post("/post", async (req, res) => {
      const result = await productCollection.insertOne(req.body)
      res.json(result)
    })
    app.post("/addPost", async (req, res) => {
      const result = await addPostCollection.insertOne(req.body)
      res.json(result)
    })
    app.get("/addPost/find", async (req, res) => {
      const find = "done"
      const result = await addPostCollection.find({find:find}).toArray()
      res.json(result)
    })
    app.get("/addPost/pre", async (req, res) => {
      const find = "pre"
      const result = await addPostCollection.find({find:find}).toArray()
      res.json(result)
    })
    app.get("/addPost/pre/:id", async (req, res) => {
      const id = req.params.id
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await addPostCollection.findOne(query)
      res.json(result)
    })

  
   
    app.post("/user", async (req, res) => {
      const result = await userCollection.insertOne(req.body)
      console.log(req.body);
      res.json(result)
    })
   
    app.put("/user", async (req, res) => {
      const user = req.body
      console.log();
      const fillter = { email: user.email }
      const options = { upsert: true };
      const updateSet = {$set:user}
      const result = await userCollection.updateOne(fillter, updateSet, options)
      res.json(result)
    })
    app.get("/post", async (req, res) => {
      
      const result = await productCollection.find({}).limit(6).toArray();
      res.send(result)
    })
    app.get("/user", async (req, res) => {
      
      const result = await userCollection.find({}).toArray();
      res.send(result)
    })

  
    app.get("/addPost", async (req, res) => {
      const result = await addPostCollection.find({}).toArray();
      res.send(result)
    })
    app.get("/addPost/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) };
      const result = await addPostCollection.findOne(query)
      res.send(result)
    })
    app.put("/addPost/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      console.log(req.body);
      const updateDoc = {
        $set: {
          find:req.body?.find
        }
      }
      const result = await addPostCollection.updateOne(query, updateDoc, options)
      res.send(result)
    })
    app.get("/booking", async (req, res) => {
      const result = await ollection.find({}).toArray();
      res.send(result)
    })
   
    app.put("/post/:id", async (req, res) => {
      const id = req.params.id
      console.log(id);
      const query = {_id: ObjectId(id)};
      console.log(query);
      const options = { upsert: true };
      console.log(req.body);
      const updateDoc = {
        $set: {
            status:req.body?.up
        },
    };
    const result = await productCollection.updateOne(query,updateDoc,options )
        res.json(result)

  })

  app.put('/user/admin',  async (req, res) => {
    const user = req.body;

            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result);
 })

    app.get("/addPost/:email", async (req, res) => {
      const email = req.params.email
      const query = addPostCollection.find({email :email })
        const result = await query.toArray()
        res.send(result)
      })
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email
      const query = userCollection.find({email :email })
        const result = await query.toArray()
        res.send(result)
      })

    app.delete("/addPost/:id", async (req, res) => {
      const id = req.params.id
      console.log(id);
      const query = { _id: ObjectId(id) };
      console.log(query);
      const result = await addPostCollection.deleteOne(query)
          res.send(result)

    })
    // app.delete("/productAll/:id", async (req, res) => {
    //   const id = req.params.id
    //   // console.log(id);
    //   const query = { _id: ObjectId(id) };
    //   console.log(query,"ok");
    //   const result = await productCollection.deleteOne(query)
    //       res.send(result)

    // })
    app.get("/post/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query)
      res.send(result)
    })
 

    console.log("ok");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


