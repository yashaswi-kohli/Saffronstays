import express from "express";
import { PORT } from "./constant.js";
import { getPriceForNext30Days } from "./controllers/price.controller.js";
import { getOccupancyForNext5Months } from "./controllers/occupancy.controller.js";

const app = express();

app.get("/airbnb/rate/:room_id", getPriceForNext30Days);
app.get("/airbnb/occupancy/:room_id", getOccupancyForNext5Months)

app.listen(PORT, () => {
    console.log("Running on port: ", PORT)
})