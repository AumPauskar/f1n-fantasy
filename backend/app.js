import express from "express";
import { PORT } from "./config.js";
import { MongoClient } from 'mongodb';

// Default MongoDB connection string
let url = process.env.MONGO_URL;
// Check if the environment variable MONGO_URL is set
if (url === undefined) {
    url = "mongodb://localhost:27017/";
}

// Create a new express application
const app = express();
app.use(express.json());

// returns the server status
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// adds a new user to the database
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
        const update = { $setOnInsert: { name: name, passwd: passwd } }; // Update command
        const options = { upsert: true }; // Option to insert if document doesn't exist

        const result = await db.collection("users").updateOne(query, update, options);

        if (result.upsertedCount > 0) {
            return res.status(200).send("User created");
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

// returns all users in the database
app.get("/api/v1/getusers", async (req, res) => {
    let db;
    const { name, passwd } = req.body;
    console.log("rootuname", name);
    console.log("rootupasswd", passwd);
    if (name !== "root" || passwd !== "root") {
        return res.status(401).send("Unauthorized");
    }
    try {
        db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const dbo = db.db("f1mongo"); // Database name

        const result = await dbo.collection("users").find({}, { projection: { _id: 0, name: 1, passwd: 1 } }).toArray();
        res.send(result);
    } catch (err) {
        console.error("Error", err);
        res.status(500).send("Internal server error");
    } finally {
        if (db) {
            await db.close();
        }
    }
});

// adds race results to the database
app.post("/api/v1/addraceresults", async (req, res) => {

    const { name, passwd, rd, results, dnf } = req.body;
    if (!name || !passwd || !rd || !results) {
        return res.status(400).send("All fields are required");
    }
    if (name !== "root" || passwd !== "root") {
        return res.status(401).send("Unauthorized");
    }
    // if the round already exists
    let db;
    // search for matches in the database for rd
    try {
        db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const dbo = db.db("f1mongo"); // Database name

        const result = await dbo.collection("results").find({ rd: rd }).toArray();
        if (result.length > 0) {
            return res.status(409).send("Round already exists");
        }
    } catch (err) {
        console.error("Error", err);
        res.status(500).send("Internal server error");
    } finally {
        if (db) {
            await db.close();
        }
    }
    // if the round does not exist
    // adding data to the database -> collections results
    try {
        db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const dbo = db.db("f1mongo"); // Database name

        const query = { rd: rd }; // Query to find the document to update
        const update = { $set: { rd: rd, results: results, dnf: dnf } }; // Update command
        const options = { upsert: true }; // Option to insert if document doesn't exist

        const result = await dbo.collection("results").updateOne(query, update, options);

        if (result.upsertedCount > 0) {
            console.log("name", name);
            console.log("passwd", passwd);
            console.log("rd", rd);
            console.log("results", results);
            console.log("dnf", dnf);
            return res.status(200).send("Results added");
        } else if (result.modifiedCount > 0) {
            return res.status(200).send("Results updated");
        }
    } catch (err) {
        console.error("Error", err);
        res.status(500).send("Internal server error");
    } finally {
        if (db) {
            await db.close();
        }
    }

});

// tests db connection
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

app.post("/api/v1/userprecictions", async (req, res) => {
    // basic prerequisites
    let db;
    const { name, passwd, rd, predictions } = req.body;

    // if name and password found in the database then add the predictions in database -> users collection
    if (!name || !passwd || !rd || !predictions) {
        return res.status(400).send("All fields are required");
    }
    try {
        db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const dbo = db.db("f1mongo"); // Database name

        const result = await dbo.collection("users").find({ name: name, passwd: passwd }).toArray();
        if (result.length === 0) {
            return res.status(401).send("Unauthorized");
        }
    } catch (err) {
        console.error("Error", err);
        res.status(500).send("Internal server error");
    } finally {
        if (db) {
            await db.close();
        }
    }

    // if the user is authorized, add the predictions to the database -> predictions collection
    try {
        db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const dbo = db.db("f1mongo"); // Database name

        const query = { name: name, rd: rd }; // Query to find the document to update
        const update = { $set: { name: name, rd: rd, predictions: predictions } }; // Update command
        const options = { upsert: true }; // Option to insert if document doesn't exist

        const result = await dbo.collection("predictions").updateOne(query, update, options);

        if (result.upsertedCount > 0) {
            return res.status(200).send("Predictions added");
        } else if (result.modifiedCount > 0) {
            return res.status(200).send("Predictions updated");
        }
    } catch (err) {
        console.error("Error", err);
        res.status(500).send("Internal server error");
    } finally {
        if (db) {
            await db.close();
        }
    }
});

// upon giving name, passwd and rd, the predictions of the user are returned
app.get("/api/v1/userpredictions", async (req, res) => {
let db;
const { name, passwd, rd } = req.body;
    if (!name || !passwd || !rd) {
        return res.status(400).send("All fields are required");
    }

    try {
        db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const dbo = db.db("f1mongo"); // Database name

        const result = await dbo.collection("predictions").find({ name: name, rd: rd }).toArray();
        res.send(result);
    } catch (err) {
        console.error("Error", err);
        res.status(500).send("Internal server error");
    } finally {
        if (db) {
            await db.close();
        }
    }
});

/* this route does the following things:
    1. gets user name and round from the request
    2. checks if the user exists and the round exists
    3. checks the results and predictions and does the following
        - if the element's position is same in both results and predictions, then point += 25
        - if the element's position varies by 1 in both results and predictions, then point += 18
        - if the element's position varies by 2 in both results and predictions, then point += 15
        - if the element's position varies by 3 in both results and predictions, then point += 12
        - if the element's position varies by 4 in both results and predictions, then point += 10
        - if the element's position varies by 5 in both results and predictions, then point += 8
        - if the element's position varies by 6 in both results and predictions, then point += 6
        - if the element's position varies by 7 in both results and predictions, then point += 4
        - if the element's position varies by 8 in both results and predictions, then point += 2
        - if the element's position varies by 9 in both results and predictions, then point += 1
    4. returns the points of the user
*/


app.get("/api/v1/validatepredictions", async (req, res) => {
    
    let db;
    const { name, passwd, rd } = req.body;
    console.log("name", name);
    console.log("passwd", passwd);
    console.log("rd", rd);

    if (!name || !passwd || !rd) {
        return res.status(400).send("All fields are required");
    }

    try {
        db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const dbo = db.db("f1mongo"); // Database name

        const result = await dbo.collection("users").find({ name: name, passwd: passwd }).toArray();
        if (result.length === 0) {
            return res.status(401).send("Unauthorized");
        }
    } catch (err) {
        console.error("Error", err);
        res.status(500).send("Internal server error");
    } finally {
        if (db) {
            await db.close();
        }
    }

    try {
        db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const dbo = db.db("f1mongo"); // Database name

        const result = await dbo.collection("results").find({ rd: rd }).toArray();
        if (result.length === 0) {
            return res.status(404).send("Round not found");
        }
    } catch (err) {
        console.error("Error", err);
        res.status(500).send("Internal server error");
    } finally {
        if (db) {
            await db.close();
        }
    }

    try {
        db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const dbo = db.db("f1mongo"); // Database name

        const result = await dbo.collection("predictions").find({ name: name, rd: rd }).toArray();
        if (result.length === 0) {
            return res.status(404).send("Predictions not found");
        }
    } catch (err) {
        console.error("Error", err);
        res.status(500).send("Internal server error");
    } finally {
        if (db) {
            await db.close();
        }
    }

    let points = 0;

    const results = result[0].results;
    const predictions = result[0].predictions;

    for (let i = 0; i < results.length; i++) {
        if (results[i] === predictions[i]) {
            points += 25;
        } else if (Math.abs(results.indexOf(predictions[i]) - i) === 1) {
            points += 18;
        } else if (Math.abs(results.indexOf(predictions[i]) - i) === 2) {
            points += 15;
        } else if (Math.abs(results.indexOf(predictions[i]) - i) === 3) {
            points += 12;
        } else if (Math.abs(results.indexOf(predictions[i]) - i) === 4) {
            points += 10;
        } else if (Math.abs(results.indexOf(predictions[i]) - i) === 5) {
            points += 8;
        } else if (Math.abs(results.indexOf(predictions[i]) - i) === 6) {
            points += 6;
        } else if (Math.abs(results.indexOf(predictions[i]) - i) === 7) {
            points += 4;
        } else if (Math.abs(results.indexOf(predictions[i]) - i) === 8) {
            points += 2;
        } else if (Math.abs(results.indexOf(predictions[i]) - i) === 9) {
            points += 1;
        }
    }

    return res.status(200).send(points.toString());

});

app.get("/api/v1/checkallraceresults", async (req, res) => {
    console.log("GET /api/v1/checkallraceresults called");
    let db;
    try {
        db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const dbo = db.db("f1mongo"); // Database name

        const result = await dbo.collection("results").find().toArray();
        res.status(200).send(result);
    } catch (err) {
        console.error("Error", err);
        res.status(500).send("Internal server error");
    } finally {
        if (db) {
            await db.close();
        }
    }
});

// sample hello world route
app.get("/", (req, res) => {
    console.log("GET / called");
    res.send("Hello World");
});