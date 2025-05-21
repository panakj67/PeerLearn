import express from "express";
import generateContent from "../controllers/apiController.js";

const apiRouter = express.Router();

apiRouter.post('/', generateContent);

export default apiRouter;
