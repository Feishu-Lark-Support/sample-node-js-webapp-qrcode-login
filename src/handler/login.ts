import {Request, Response} from "express";
import axios from "axios";
import {v4 as v4UUid} from "uuid";
import path from "path";

import {
    CLIENT_ID,
    CLIENT_SECRET,
    PASSPORT_OAUTH_TOKEN,
    PASSPORT_OAUTH_USERINFO,
    REDIRECT_URI
} from "../config";
import {Handler} from "../route";
import db from "../db";
import {OauthTokenResponse} from "../model";

export const loginHandler: Handler = async (req: Request, res: Response) => {
    const {code = undefined, state = undefined} = req.query;
    if (code === undefined) {
        // 非常规操作，重定向到首页
        res.redirect('/');
        return;
    }
    const response = await axios({
        method: 'POST',
        url: PASSPORT_OAUTH_TOKEN,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI,
        },
    });
    const data: OauthTokenResponse = (response as any).data as OauthTokenResponse;
    const uuid = v4UUid();
    db.setOauth2(uuid, data);
    res.redirect(`/loginSuccess?uuid=${uuid}`);
}

export const loginSuccessHandler: Handler = (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.sendFile(path.join(__dirname, `../views/loginSuccess.html`));
};

export const queryUserById: Handler = async (req: Request, res: Response) => {
    const {user_id} = req.params;
    if (db.hasUser(user_id)) {
        const user = db.getUserById(user_id);
        res.json({code: 0, data: user, msg: 'ok'});
        return;
    }
    const oauth2 = db.getOauth2RespById(user_id as string);
    const token = oauth2?.access_token;
    const userData = await axios({
        method: 'GET',
        url: PASSPORT_OAUTH_USERINFO,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    res.json({code: 0, data: userData.data, msg: 'ok'});
};
