import { Router } from "express";
import { acceptRequest, declineRequest, getReqs, sendReq } from "../controllers/requests.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/send',authMiddleware,sendReq);
router.get('/getReqs/',getReqs);
router.patch('/acceptRequest/',authMiddleware,acceptRequest);
router.patch('/declineRequest/',declineRequest);

export default router