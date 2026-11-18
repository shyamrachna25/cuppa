import { getDb } from "./connection.js";
import { ObjectId } from "mongodb";

async function usersCollection() {
  const db = await getDb();
  return db.collection("users");
}

export async function findByUsername(username) {
  const users = await usersCollection();
  return users.findOne({ username });
}

export async function findById(id) {
  const users = await usersCollection();
  return users.findOne({ _id: new ObjectId(id) });
}

export async function createUser({ username, passwordHash }) {
  const users = await usersCollection();
  // REVIEW: register does findByUsername and then insertOne as two separate steps, so two
  // simultaneous requests with the same username can both pass the check and create duplicates.
  // A unique index (users.createIndex({ username: 1 }, { unique: true })) would enforce it in
  // the database, and the route could handle the duplicate key error (code 11000) with the 409.
  // Similar indexes would help the list queries: brews { userId: 1, date: -1 } and
  // tastings { createdAt: -1 }. Usernames are also case-sensitive, so "Maya" and "maya" can coexist.
  const result = await users.insertOne({
    username,
    passwordHash,
    createdAt: new Date(),
  });
  return { _id: result.insertedId, username };
}
