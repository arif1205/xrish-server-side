const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@travelagency.isevs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function run() {
	try {
		await client.connect();
		console.log("Database connected successfully");
		const database = client.db("authentic_watch");
		const productsCollection = database.collection("products");
		// const teamCollection = database.collection("teams");
		// const orderCollection = database.collection("orders");

		app.get("/products", async (req, res) => {
			const cursor = productsCollection.find({});
			const products = await cursor.toArray();
			res.send(products);
		});

		// app.get("/teams", async (req, res) => {
		// 	const cursor = teamCollection.find({});
		// 	const teams = await cursor.toArray();
		// 	res.send(teams);
		// });

		// order place api
		// app.post("/orders", async (req, res) => {
		// 	const newOrder = req.body;
		// 	const result = await orderCollection.insertOne(newOrder);
		// 	res.json(result);
		// });

		// new service add
		// app.post("/services", async (req, res) => {
		// 	const newOrder = req.body;
		// 	const result = await serviceCollection.insertOne(newOrder);
		// 	res.json(result);
		// });

		// get order
		// app.get("/orders", async (req, res) => {
		// 	const cursor = orderCollection.find({});
		// 	const orders = await cursor.toArray();
		// 	res.send(orders);
		// });

		// update order
		// app.put("/orders/:id", async (req, res) => {
		// 	const id = req.params.id;
		// 	const result = await orderCollection.updateOne(
		// 		{ _id: ObjectId(id) },
		// 		{ $set: { status: true } }
		// 	);
		// 	res.json(result);
		// });

		// delete order
		// app.delete("/orders/:id", async (req, res) => {
		// 	const id = req.params.id;
		// 	const result = await orderCollection.deleteOne({ _id: ObjectId(id) });
		// 	res.json(result);
		// });
	} finally {
		// await client.close()
	}
}

run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("This is our project server");
});

app.listen(port, () => {
	console.log("Running on port " + port);
});