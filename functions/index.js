const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();
const app = express();
app.use(cors({ origin: true }));

// Routes

// Get single user
app.get("/:id", async (request, response) => {
  const userCollectionRef = db.collection("users");
  const result = await userCollectionRef.doc(request.params.id).get();

  const id = result.id;
  const user = result.data();

  response.status(200).send({ id, ...user });
});


// Get all users
app.get("/", async (request, response) => {
  const userCollectionRef = db.collection("users");
  const result = await userCollectionRef.get();

  let users = [];
  result.forEach((userDoc) => {
    const id = userDoc.id;
    const data = userDoc.data();
    users.push({ id, ...data });
  });

  response.status(200).send(users);
});

// Update user
app.put("/:id", async (request, response) => {
  const userCollectionRef = db.collection("users");
  const result = await userCollectionRef
    .doc(request.params.id)
    .update(request.body);

  response.status(200).send(result);
});

// Create user
app.post("/", async (request, response) => {
  const newUser = JSON.parse(request.body);
  
  const userCollectionRef = db.collection("users");
  const result = await userCollectionRef.add(newUser);
  
  response.status(200).send(result.id);
});

// Delete user
app.delete("/:id", async (request, response) => {
  const userId = request.params.id;
  const userCollectionRef = db.collection("users");
  const result = await userCollectionRef.doc(userId).delete();

  response.status(200).send(result);
});

exports.users = functions.https.onRequest(app);