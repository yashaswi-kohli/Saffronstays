import { Router } from "express";
import { getPriceForNext30Days } from "../controllers/price.controller.js";
import { getOccupancyForNext5Months } from "../controllers/occupancy.controller.js";

const router = Router();

router.route("/rate/:room_id").get(getPriceForNext30Days);
router.route("/occupancy/:room_id").get(getOccupancyForNext5Months);

export default router;