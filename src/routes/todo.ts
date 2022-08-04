import express from "express";
import {findAll, index, load, save} from "../controllers/todo";

const router = express.Router();

router.get("/all", findAll);
router.get("/load", load);
router.post("/save", save);
router.post("/index", index);

export default router;