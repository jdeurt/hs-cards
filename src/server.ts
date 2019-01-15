import express from "express";
import handleRequest from "./api";

const app = express();

app.get("/", handleRequest);

export default app;