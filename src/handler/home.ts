import path from "path";
import * as fs from "fs";
import * as template from 'art-template';

import {Handler} from "../route";
import {Request, Response} from "express";

export const indexHandler: Handler = async (req: Request, res: Response) => {
    const fileObj = fs.readFileSync(path.resolve(__dirname, '../views/index.html'));
    const htmlStr = template.render(fileObj.toString(), {
        CLIENT_ID: process.env.CLIENT_ID,
        REDIRECT_URI: process.env.REDIRECT_URI,
    });
    res.send(htmlStr);
};