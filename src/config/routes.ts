import {Application, NextFunction, Request, Response} from "express";
import home from "../routes/home";
import todo from "../routes/todo";
import {Cache} from "../types/cache";
import {Client} from "@elastic/elasticsearch";

const useRoutes = (app: Application) => {
    app.use("/", home);
    app.use("/todos", todo)
}

export const addClients = (app: Application, redis: Cache, elastic: Client) => {
    app.use((req: Request, _: Response, next: NextFunction) => {
        req.redis = redis;
        req.elastic = elastic;
        next();
    });
}

export default useRoutes;