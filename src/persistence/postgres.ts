import waitPort from "wait-port";
import fs from "fs";
import { Client } from "pg";
import { dbConfig } from "../config";

let client: Client;

async function init(): Promise<void> {
  const { HOST, USER, PASSWORD, DB } = dbConfig;

  await waitPort({
    host: HOST,
    port: 5432,
    timeout: 30000,
    waitForDns: true,
  });
  client = new Client({
    user: USER,
    host: HOST,
    database: DB,
    password: PASSWORD,
    port: 5432,
  });
  try {
    await client.connect();
    console.log(`Connected to postgres db at host ${HOST}`);
    // await client.query("")
    console.log("Database created successfully");
  } catch (error) {
    console.log(`Error connecting to database: ${error}`);
  }
}

export { client, init };
