const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://eco-track:3ubWeuL1ObeBTDGt@cluster0.cymbxlh.mongodb.net/?appName=Cluster0";

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
    challengesCollection = db.collection("challenges");
    recentTipsCollection = db.collection("recent-tips");
    recentEventCollection = db.collection("event");

    app.get("/challenges", async (req, res) => {
      const result = await challengesCollection.find().toArray();
      console.log(result);
      res.send(result);
    });
    app.get("/challenges/:id", async (req, res) => {
      const id = req.params;
      console.log(id);
      const result = await challengesCollection.findOne({_id: new ObjectId(id)})
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
