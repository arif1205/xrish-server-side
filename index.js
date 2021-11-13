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
		const reviewsCollection = database.collection("reviews");
		const orderCollection = database.collection("orders");
		const usersCollection = database.collection("users");

		// add users
		app.post("/users", async (req, res) => {
			const newOrder = { ...req.body, role: "customer" };
			const result = await usersCollection.insertOne(newOrder);
			res.json(result);
		});

		// get users
		app.get("/users", async (req, res) => {
			const email = req.query;
			const cursor = usersCollection.find(email);
			const result = await cursor.toArray();
			res.json(result);
		});

		// Update role
		app.put("/users", async (req, res) => {
			const email = req.query;
			const result = await usersCollection.updateOne(email, {
				$set: { role: "admin" },
			});
			res.json(result);
		});

		// find all products
		app.get("/products", async (req, res) => {
			const cursor = productsCollection.find({});
			const products = await cursor.toArray();
			res.send(products);
		});

		// find products using id
		app.get("/products/:id", async (req, res) => {
			const id = req.params.id;
			const cursor = productsCollection.find({ _id: ObjectId(id) });
			const result = await cursor.toArray();
			res.json(result);
		});

		// new products add
		app.post("/products", async (req, res) => {
			const newOrder = req.body;
			const result = await productsCollection.insertOne(newOrder);
			res.json(result);
		});

		// delete products
		app.delete("/products", async (req, res) => {
			const { id } = req.query;
			const result = await productsCollection.deleteOne({ _id: ObjectId(id) });
			res.json(result);
		});

		// get reviews
		app.get("/reviews", async (req, res) => {
			const cursor = reviewsCollection.find({});
			const reviews = await cursor.toArray();
			res.send(reviews);
		});

		// add reviews
		app.post("/reviews", async (req, res) => {
			const newReview = req.body;
			const result = await reviewsCollection.insertOne(newReview);
			res.json(result);
		});

		// order place
		app.post("/orders", async (req, res) => {
			const newOrder = req.body;
			const result = await orderCollection.insertOne(newOrder);
			res.json(result);
		});

		// get order
		app.get("/orders", async (req, res) => {
			const email = req.query;
			const cursor = orderCollection.find(email);
			const orders = await cursor.toArray();
			res.send(orders);
		});

		// update order
		app.put("/orders", async (req, res) => {
			const { id } = req.query;
			const result = await orderCollection.updateOne(
				{ _id: ObjectId(id) },
				{ $set: { status: "Shipped" } }
			);
			res.json(result);
		});

		// delete order
		app.delete("/orders", async (req, res) => {
			const id = req.query;
			const result = await orderCollection.deleteOne({ _id: ObjectId(id) });
			res.json(result);
		});
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
