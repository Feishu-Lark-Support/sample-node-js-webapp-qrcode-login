import express from 'express';
import {NextFunction, Request, Response} from 'express';
import cors from 'cors';
import {PORT} from "./config";
import * as dotenv from 'dotenv';
import * as path from "path";

import {router} from "./route";
import {getMyIPAddress} from "./utils";

const app = express();
dotenv.config({path: path.resolve(__dirname, '../.env')});

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
    const networkIp = await getMyIPAddress() || process.env.DEFAULT_RUNTIME_IP;
    console.log(`  App running at:
  - Local:   http://${process.env.DEFAULT_RUNTIME_IP}:${PORT}/
  - Network: http://${networkIp}:${PORT}/

  Note that the development build is not optimized.
  To create a production build, run npm run build.`);
});
