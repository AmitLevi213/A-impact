import express from "express";
import { getBusinessRequirements } from "../controllers/businessController.js";

const router = express.Router();

router.post("/", getBusinessRequirements); // Define POST /business

export default router;
