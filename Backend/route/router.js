import express from "express";
import businessRoutes from "../routes/businessRoutes.js";
import { handleError } from "../utils/handleErrors.js";

const router = express.Router();

router.use("/business", businessRoutes); // Mount businessRoutes at /business

router.use((req, res) => {
  handleError(res, 404, "המשאב לא נמצא");
});

export default router;
