const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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

async function run() {
  try {
    const serviceCollection = client.db("photography").collection("services");
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });
    app.get("/services-all", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const servicesAll = await cursor.toArray();
      res.send(servicesAll);
    });
  } finally {
  }
}
run().catch((error) => console.error(error));
app.get("/", (req, res) => {
  res.send("photography server is running");
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
