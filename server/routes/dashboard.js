import express from "express";
import authMiddleware from "../middleware/authMiddleware.js" ; 
import { getDashData } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/" , authMiddleware , getDashData);




export default router ;