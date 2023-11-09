import express, { Request, Response } from "express";
import router from "./routes/routes";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use("/", router);

export default app;
