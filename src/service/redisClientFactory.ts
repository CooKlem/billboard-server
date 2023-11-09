import { createClient } from "redis";

const dbClient = createClient();

dbClient.on("error", (err) => console.log("Redis Client Error", err));

export default dbClient;
