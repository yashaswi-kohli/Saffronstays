import { Router } from "express";

const router = Router();

router.route("/price/:room_id");
router.route("/occupation/:room_id");

export default router;