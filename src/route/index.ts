import {RequestHandler as Middleware, Response, Request} from 'express';
import {loginHandler, loginSuccessHandler, queryUserById} from "../handler/login";
import {indexHandler} from "../handler/home";

type Method =
    | 'get'
    | 'post'
    | 'head'
    | 'put'
    | 'delete'
    | 'connect'
    | 'patch'
    | 'options'
    | 'trace';

export type Handler = (req: Request, res: Response) => any;

export type Route = {
    method: Method;
    path: string;
    middleware: Middleware[];
    handler: Handler;
}

export const router: Route[] = [
    {
        method: 'get',
        path: '/',
        middleware: [],
        handler: indexHandler
    },
    {
        method: 'get',
        path: '/login',
        middleware: [],
        handler: loginHandler
    },
    {
        method: 'get',
        path: '/loginSuccess',
        middleware: [],
        handler: loginSuccessHandler
    },
    {
        method: 'get',
        path: '/v1/users/:user_id',
        middleware: [],
        handler: queryUserById,
    }
];
