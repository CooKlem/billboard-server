import { Request, Response } from "express";
import fs from "fs";
import dbClient from "../service/redisClientFactory";

interface CounterResponse {
	count: number;
}

export async function getCounter(req: Request, res: Response) {
	try {
		const cntRes: CounterResponse = { count: 0 };
		cntRes.count = Number(await dbClient.get("count"));
		res.status(200).json(cntRes);
	} catch (error) {
		res.status(500).json(error);
	}
}

export async function updateCounter(req: Request, res: Response) {
	try {
		const body = req.body;
		logReqBody(body);

		if ("count" in body) {
			const count = parseFloat(body.count);
			if (Number.isNaN(count)) {
				res.status(400).json({
					message: "Parameter count should contains only numbers!",
				});
				return;
			}
			await dbClient.incrByFloat("count", count);
		}
		res.sendStatus(200);
	} catch (error) {
		res.status(500).json(error);
	}
}

function logReqBody(body: any) {
	const logStream = fs.createWriteStream("log.txt", { flags: "a" });
	var currentdate = new Date();
	var datetime =
		currentdate.getDate() +
		"/" +
		(currentdate.getMonth() + 1) +
		"/" +
		currentdate.getFullYear() +
		" " +
		currentdate.getHours() +
		":" +
		currentdate.getMinutes() +
		":" +
		currentdate.getSeconds();
	logStream.write(datetime + ": " + JSON.stringify(body) + "\n");
	logStream.end();
}
