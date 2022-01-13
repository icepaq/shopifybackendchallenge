const { MongoClient } = require('mongodb');

export default async function handler(req, res) {
    const uri = "mongodb+srv://shopify:shopify@cluster0.dgxwh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db("shopify");
    const collection = db.collection("products");

    const name = req.query.name;
    const price = req.query.price;

    if (name === undefined || price === undefined) {
        res.status(400).json({
            error: "Missing name or price"
        });
        return;
    }

    const product = {
        name: name,
        price: price
    };

    const result = await collection.insertOne(product);

    res.status(200).json({
        id: result.insertedId,
    });
}
