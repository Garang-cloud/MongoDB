const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"; // Ensure MongoDB is running locally
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");

        const database = client.db("contact");
        const collection = database.collection("contactlist");

        await collection.insertMany([
            { last_name: "Ben", first_name: "Moris", email: "jgarang390@gmail.com", age: 26 },
            { last_name: "Kefi", first_name: "Seif", email: "kefi@gmail.com", age: 15 },
            { last_name: "Emilie", first_name: "Brouge", email: "emilie.b@gmail.com", age: 40 },
            { last_name: "Alex", first_name: "Brown", age: 4 },
            { last_name: "Denzel", first_name: "Washington", age: 3 }
        ]);

        console.log("Contacts inserted!");

        // Display all contacts
        const allContacts = await collection.find().toArray();
        console.log("All Contacts:", allContacts);

        // Display one person by ID (using the first inserted contact as an example)
        const oneContact = await collection.findOne({ _id: allContacts[0]._id });
        console.log("One Contact by ID:", oneContact);

        // Display contacts with age > 18
        const adults = await collection.find({ age: { $gt: 18 } }).toArray();
        console.log("Contacts with age > 18:", adults);

        // Display contacts with age > 18 and first_name containing 'ah' (case-insensitive)
        const filtered = await collection.find({ age: { $gt: 18 }, first_name: { $regex: "ah", $options: "i" } }).toArray();
        console.log("Contacts with age > 18 and name containing 'ah':", filtered);

        await collection.updateOne(
            { last_name: "Kefi", first_name: "Seif" },
            { $set: { first_name: "Anis" } }
        );
        console.log("Updated Kefi Seif to Kefi Anis!");

        await collection.deleteMany({ age: { $lt: 5 } });
        console.log("Deleted contacts younger than 5!");

        const updatedContacts = await collection.find().toArray();
        console.log("Updated Contacts:", updatedContacts);
    } finally {
        await client.close();
        console.log("Disconnected from MongoDB!");
    }
}

run().catch(console.dir);
