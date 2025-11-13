const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
console.log(process.env);
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cymbxlh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("eco-track");
   const challengesCollection = db.collection("challenges");
   const recentTipsCollection = db.collection("recent-tips");
   const recentEventCollection = db.collection("event");
   const ChallengesJoin = db.collection("join");

    app.get("/challenges", async (req, res) => {
      const result = await challengesCollection.find().toArray();
      console.log(result);
      res.send(result);
    });
    app.post("/challenges", async (req, res) => {
      const data = req.body;
      const result = await challengesCollection.insertOne(data);
      res.send(result);
    });
    app.get("/challenges/:id", async (req, res) => {
      const id = req.params;
      console.log(id);
      const result = await challengesCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    app.get("/my-activities/:id", async (req, res) => {
      const id = req.params;
      console.log(id);
      const result = await ChallengesJoin.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.get("/challenges/join", async (req, res) => {
      const result = await ChallengesJoin.find().toArray();
      console.log(result);
      res.send(result);
    });
    app.post("/challenges/join", async (req, res) => {
      const data = req.body;
      const result = await ChallengesJoin.insertOne(data);
      res.send(result);
    });
    app.get("/challenges/join/:id", async (req, res) => {
      const userId = req.params.id;
      const query = {
        userId: userId,
      };
      const cursor = ChallengesJoin.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/my-activities", async (req, res) => {
      const query = {};
      if (query.userId) {
        query.userId = userId;
      }

      const cursor = ChallengesJoin.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/my-activities/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ChallengesJoin.deleteOne(query);
      res.send(result);
    });

    app.patch("/my-activities/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;

      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          status: data.status,
          progress: data.progress,
        },
      };
      const options = {};

      const result = await ChallengesJoin.updateOne(query, update, options);
      res.send(result);
    });

    app.get("/recent-tips", async (req, res) => {
      const result = await recentTipsCollection.find().toArray();
      console.log(result);
      res.send(result);
    });
    app.get("/event", async (req, res) => {
      const result = await recentEventCollection.find().toArray();
      console.log(result);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World! How are you");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
