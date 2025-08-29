import express from "express";
import { getSbi } from "../controller/sbi.controller.js";


const router = express.Router();

router.get("/" ,getSbi);

export default router;

