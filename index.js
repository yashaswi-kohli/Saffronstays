import express from "express";
import { PORT } from "./constant.js";

import { getPriceForNext30Days } from "./Controllers/price.controller.js";
import { getOccupancyForNext5Months } from "./Controllers/occupancy.controller.js";

const app = express();

app.get("/", (req, res) => {
    res.json({
        "rate endpoint": "/rate/:room_id",
        "occupancy endpoint": "/occupancy/:room_id",
    })
})
app.get("/rate/:room_id", getPriceForNext30Days);
app.get("/occupancy/:room_id", getOccupancyForNext5Months)

app.listen(PORT, () => {
    console.log("Running on port: ", PORT)
})