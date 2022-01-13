const { MongoClient } = require('mongodb');

export default async function handler(req, res) {
    const uri = "mongodb+srv://shopify:shopify@cluster0.dgxwh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db("shopify");
    const collection = db.collection("products");

    const cursor = collection.find();

    let products = [];

    // The cursor is a MongoDB cursor object. It is used to iterate over the results of a query.
    await cursor.forEach(product => {
        products.push(product);
    });

    res.status(200).json(products);
}
