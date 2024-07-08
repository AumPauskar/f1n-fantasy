import express from "express";
import { PORT } from "./config.js";

// mongodb connection
import { MongoClient } from 'mongodb';
const url = "mongodb://localhost:27017/"; // Replace with your MongoDB connection string

const app = express();
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post("/api/v1/createusers", async (req, res) => {
    const { name, passwd } = req.body;
    console.log("name", name);
    console.log("passwd", passwd);

    if (!name || !passwd) {
        return res.status(400).send("Both 'name' and 'passwd' fields are required");
    }

    let db;
    try {
        const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db("f1mongo"); // Database name
        const query = { name: name }; // Query to find the document to update
        const update = { $set: { name: name, passwd: passwd } }; // Update command
        const options = { upsert: true }; // Option to insert if document doesn't exist

        const result = await db.collection("users").updateOne(query, update, options);

        if (result.upsertedCount > 0) {
            return res.status(200).send("User created");
        } else if (result.modifiedCount > 0) {
            return res.status(200).send("User updated");
        } else {
            return res.status(200).send("No changes made to the user");
        }
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        return res.status(500).send("Internal server error");
    } finally {
        if (db) {
            await db.client.close();
        }
    }
});

app.get("/api/v1/users", (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
        if (err) {
            console.error("Error connecting to MongoDB", err);
            return res.status(500).send("Internal server error");
        }
        const dbo = db.db("f1mongo"); // Database name

        dbo.collection("users").find({}, { projection: { _id: 0, name: 1, passwd: 1 } }).toArray((err, result) => {
            if (err) {
                console.error("Error retrieving users", err);
                return res.status(500).send("Error retrieving users");
            }
            res.send(result);
            db.close();
        });
    });
});

app.get("/test", async (req, res) => {
    let client;
    try {
        client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Successfully connected to MongoDB");
        const dbo = client.db("f1mongo");
        // Proceed with database operations, ensuring to log errors and successes where appropriate.

        // Send the response before closing the client connection
        return res.status(200).send("Successfully connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        return res.status(500).send("Internal server error");
    } finally {
        // Ensure the client connection is closed in the finally block
        if (client) {
            await client.close();
        }
    }
});
app.get("/", (req, res) => {
    res.send("Hello World");
});