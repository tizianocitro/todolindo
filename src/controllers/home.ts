import {Request, Response} from "express";

export const home = (req: Request, res: Response) => {
    req.session.username = "Tiziano";
    res.status(200).send(`Welcome ${req.session.username}`);
}