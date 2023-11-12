import { Request, Response } from "express";
import dbClient from "../service/redisClientFactory";
import { logReqBody } from "../utils/utils";

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
