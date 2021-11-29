import {Handler} from "../route";
import {Request, Response} from "express";
import path from "path";

export const indexHandler: Handler = async (req: Request, res:Response) => {
    res.sendFile(path.join(__dirname, '../views/index.html'))
};