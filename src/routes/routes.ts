import express from "express";
import { getCounter, updateCounter } from "../controllers/controller";

const router = express.Router();

router.post("/track", updateCounter);

router.get("/count", getCounter);

export default router;
