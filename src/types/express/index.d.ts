import "express";
import {Cache} from "../types/cache"
import {Client} from "@elastic/elasticsearch";

declare global {
    namespace Express {
        interface Request {
            redis?: Cache,
            elastic?: Client | null
        }
    }
}