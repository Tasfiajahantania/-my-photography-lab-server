const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hyahdcy.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// server
async function run() {
  try {
    const serviceCollection = client.db("photography").collection("services");
    const reviewCollection = client.db("photography").collection("review");
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });
    const cursor = reviewCollection.find(query).sort({ total_time: -1 });
    const reviews = await cursor.toArray();
    res.send(reviews);
    app.get("/services-all", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const servicesAll = await cursor.toArray();
      res.send(servicesAll);
    });
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });
    app.post("/add-review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
    app.get("/review/:id", async (req, res) => {
      const query = {
        service: req.params.id,
      };
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    app.get("/my-review/:email", async (req, res) => {
      const query = {
        email: req.params.email,
      };
      const cursor = reviewCollection.find(query);
      const myReview = await cursor.toArray();
      res.send(myReview);
    });
  } finally {
  }
}
run().catch((error) => console.error(error));
app.get("/", (req, res) => {
  res.send("photography server is running....");
});

app.listen(port, () => {
  console.log(`server is running... on ${port}`);
});
