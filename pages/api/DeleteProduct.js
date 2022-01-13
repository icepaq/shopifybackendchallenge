const { MongoClient, ObjectId } = require('mongodb');

export default async function handler(req, res) {
    // Connect to MongoDB
    const uri = "mongodb+srv://shopify:shopify@cluster0.dgxwh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db("shopify");
    const collection = db.collection("products");

    const id = req.query.id;

    // The object ID is required for editing a product. Uses MongoDB's ObjectId class.
    const oID = new ObjectId(id);
    const result = await collection.deleteOne({_id: oID});

    console.log(result);

    res.status(200).json(result);
}
