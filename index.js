import express from "express";
import { PORT } from "./constant.js";
import roomRouter from "./Router/room.router.js";

const app = express();
app.use("/airbnb", roomRouter);

app.listen(PORT, () => {
    console.log("Running on port: ", PORT)
})