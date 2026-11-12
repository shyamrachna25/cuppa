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
  const result = await users.insertOne({
    username,
    passwordHash,
    createdAt: new Date(),
  });
  return { _id: result.insertedId, username };
}