const { MongoClient, ObjectId } = require('mongodb');

export default async function handler(req, res) {
    const uri = "mongodb+srv://shopify:shopify@cluster0.dgxwh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db("shopify");
    const collection = db.collection("products");

    const id = req.query.id;
    const newName = req.query.name;
    const newPrice = req.query.price;

    console.log(id);

    // The object ID is required for editing a product
    if (id === undefined) {
        res.status(400).json({
            error: "Missing id"
        });
        return;
    }

    // The object ID is required for editing a product. Uses MongoDB's ObjectId class.
    const oID = new ObjectId(id);
    const result = await collection.updateOne({ _id: oID }, { $set: { name: newName, price: newPrice } });
    console.log(result);

    res.status(200).json(result);
}
