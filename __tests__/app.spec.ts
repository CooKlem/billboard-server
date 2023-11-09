import request from "supertest";
import app from "../src/app";
import dbClient from "../src/service/redisClientFactory";
import fs from "fs";

const FILENAME = "log.txt";

describe("app.ts", () => {
	beforeEach(() => {
		dbClient.set("count", 0);
		if (fs.existsSync(FILENAME)) fs.unlinkSync("log.txt");
	});

	afterEach(() => {
		if (fs.existsSync(FILENAME)) fs.unlinkSync("log.txt");
	});

	test("POST /track should create new file and writes to it if no file exists", async () => {
		expect(fs.existsSync(FILENAME)).not.toBeTruthy();

		const testValue = { count: 5 };
		const res = await request(app).post("/track").send(testValue);

		expect(res.statusCode).toBe(200);
		expect(fs.existsSync(FILENAME)).toBeTruthy();
		expect(fs.readFileSync(FILENAME, "utf-8")).toContain(
			JSON.stringify(testValue)
		);
	});

	test("POST /track should append to file if there are data", async () => {
		const testFileFluff = JSON.stringify({ object: "value" });
		fs.writeFileSync(FILENAME, testFileFluff + "\n");
		expect(fs.existsSync(FILENAME)).toBeTruthy();

		const testValue = { count: 5 };
		const res = await request(app).post("/track").send(testValue);

		expect(res.statusCode).toBe(200);
		expect(fs.existsSync(FILENAME)).toBeTruthy();
		expect(fs.readFileSync(FILENAME, "utf-8")).toMatch(
			JSON.stringify(testValue)
		);
	});

	test("POST /track should write count parameter to database if it's empty", async () => {
		const testValue = { count: 5 };
		const res = await request(app).post("/track").send(testValue);

		expect(res.statusCode).toBe(200);
		expect(dbClient.get("count")).toBe(testValue.count);
	});

	test("POST /track should increase count in database with count parameter", async () => {
		const dbValue = 20;
		dbClient.set("count", dbValue);
		expect(dbClient.get("count")).toBe(dbValue);

		const testValue = { count: 5 };
		const res = await request(app).post("/track").send(testValue);

		expect(res.statusCode).toBe(200);
		expect(dbClient.get("count")).toBe(testValue.count + dbValue);
	});

	test("POST /track should increase count in database with negative count parameter", async () => {
		const dbValue = 20;
		dbClient.set("count", dbValue);
		expect(dbClient.get("count")).toBe(dbValue);

		const testValue = { count: -5 };
		const res = await request(app).post("/track").send(testValue);

		expect(res.statusCode).toBe(200);
		expect(dbClient.get("count")).toBe(testValue.count + dbValue);
	});

	test("POST /track should increase count in database with count parameter from multiple paramaters", async () => {
		const dbValue = 20;
		dbClient.set("count", dbValue);
		expect(dbClient.get("count")).toBe(dbValue);

		const testValue = {
			object: { value: 3 },
			stringObj: "test",
			numberObj: 7,
			count: 5,
		};
		const res = await request(app).post("/track").send(testValue);

		expect(res.statusCode).toBe(200);
		expect(dbClient.get("count")).toBe(testValue.count + dbValue);
	});

	test("POST /track shouldn't increase count in database when count parameter isn't sent", async () => {
		const dbValue = 20;
		dbClient.set("count", dbValue);
		expect(dbClient.get("count")).toBe(dbValue);

		const testValue = {
			object: { value: 3 },
			stringObj: "test",
			numberObj: 7,
		};
		const res = await request(app).post("/track").send(testValue);

		expect(res.statusCode).toBe(200);
		expect(dbClient.get("count")).toBe(dbValue);
	});

	test("POST /track should handle errors during db setting", async () => {
		const dbValue = 20;
		dbClient.set("count", dbValue);
		expect(dbClient.get("count")).toBe(dbValue);

		const testValue = { count: 5 };
		dbClient.incrByFloat = jest.fn().mockImplementation(() => {
			throw new Error();
		});
		const res = await request(app).post("/track").send(testValue);

		expect(res.statusCode).toBe(500);
		expect(dbClient.get("count")).toBe(dbValue);
		jest.clearAllMocks();
	});

	test("POST /track shouldn't increase count in database when count parameter isn't number", async () => {
		const dbValue = 20;
		dbClient.set("count", dbValue);
		expect(dbClient.get("count")).toBe(dbValue);

		const testValue = {
			object: { value: 3 },
			stringObj: "test",
			numberObj: 7,
			count: "Hello World",
		};
		const res = await request(app).post("/track").send(testValue);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toMatch(
			"Parameter count should contains only numbers!"
		);
		expect(dbClient.get("count")).toBe(dbValue);
	});

	test("GET /count should get count from database", async () => {
		const dbValue = 20;
		dbClient.set("count", dbValue);
		expect(dbClient.get("count")).toBe(dbValue);

		const res = await request(app).get("/count").send();

		expect(res.statusCode).toBe(200);
		expect(res.body.count).toBe(dbValue);
	});

	test("GET /count should handle error during db read", async () => {
		dbClient.get = jest.fn().mockImplementation(() => {
			throw new Error();
		});
		const res = await request(app).get("/count").send();

		expect(res.statusCode).toBe(500);

		jest.clearAllMocks();
	});
});
