import express from 'express';
import {NextFunction, Request, Response} from 'express';
import cors from 'cors';
import {PORT} from "./config";
import path from "path";

import {router} from "./route";
import {getMyIPAddress} from "./utils";

const app = express();

app.use(cors());
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path !== '/' && !req.path.includes('.')) {
        res.set({
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Origin': req.headers.origin || '*',
            'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
            'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
            'Content-Type': 'application/json; charset=utf-8',
        });
    }
    req.method === 'OPTIONS' ? res.status(200).end() : next();
});

// 注册路由、中间件、handler
router.forEach((r) => {
    const {method, path, middleware, handler} = r;
    console.log(method, '-------', path);
    app[method](path, ...middleware, handler);
});

app.listen(PORT, async () => {
    console.log(`localhost: server is running on http://127.0.0.1:${PORT}/`);
    const networkIp = await getMyIPAddress();
    console.log(`network: server is running on http://${networkIp}:${PORT}/`);
});
