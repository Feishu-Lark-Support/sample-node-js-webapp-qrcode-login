# sample-node-js-webapp-qrcode-login

1. [概述](#概述)
2. [运行环境](#运行环境)
3. [安装方法](#安装方法)
4. [快速使用](#快速使用)
4. [更多信息](#更多信息)
4. [License](#License)

# 概述

为了实现在网页内部完成授权登录的流程，避免跳转到飞书登录页，保证流畅的体验，可以接入二维码 SDK 将飞书登录的二维码嵌入到网页中。

这个 Sample 主要实现了用户在自己的系统内通过飞书扫码网页上的二维码并获取到自己的个人信息。

#	运行环境

- Node v12.22.3及以上

下载地址：[Node Download](https://nodejs.org/zh-cn/download/)

# 安装方法

- 在项目目录下，执行如下指令安装项目依赖

```shell
npm install
```

如果卡顿或速度过慢时，可中断下载并尝试镜像下载

```shell
npm install --registry=https://registry.npm.taobao.org
```

# 快速使用

1. 修改配置 config `src/config/index.ts`

```typescript
export const REDIRECT_URI = 'Enter_the_Redirect_URI_Here'; // 参考文档：https://open.feishu.cn/document/uYjL24iN/uYjN3QjL2YzN04iN2cDN

export const CLIENT_ID = 'Enter_the_Application_Id_Here';
export const CLIENT_SECRET = 'Enter_the_Application_Secret_Here';
```

2. 构造二维码页面 `src/views/index.html`

```typescript
const CLIENT_ID = 'Enter_the_Application_Id_Here';
const REDIRECT_URI = encodeURIComponent('Enter_the_Redirect_URI_Here'); // 参考文档：https://open.feishu.cn/document/uYjL24iN/uYjN3QjL2YzN04iN2cDN
const goto = `https://www.feishu.cn/suite/passport/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&state=STATE`;
const QRLoginObj = QRLogin({
	id: 'qrCode',
	goto,
	width: '500',
	height: '500',
});
```

3. 在项目目录下，执行命令

```sh
npm run dev
```

即可打印出服务中的路由信息，以及访问 Sample 的 URL地址

```
get ------- /
get ------- /login
get ------- /loginSuccess
get ------- /v1/users/:user_id
  App running at:
  - Local:   http://127.0.0.1:9000/
  - Network: http://xx.xx.xx.xx:9000/

  Note that the development build is not optimized.
  To create a production build, run npm run build.

```

# 更多信息

## 路由

路由类型

包含 [method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)、path、middleware和handler属性，分别表示请求方法，请求路径，中间件和处理器

```typescript
export type Route = {
    method: Method;
    path: string;
    middleware: Middleware[];
    handler: Handler;
}
```

路由定义

所有的接口信息全部定义在 `src/route/index.ts`，可以通过定义如 `src/route/login.ts`	导出`login`相关业务业路由并在 `src/route/index.ts`中引用即可。

注册路由

该逻辑在 `src/app.ts` ，我们上面定义的是一个  `Route` 类型的数组，因此在 app 中遍历即可

```typescript
router.forEach((r) => {
    const {method, path, middleware, handler} = r;
    console.log(method, '-------', path);
    app[method](path, ...middleware, handler);
});
```

## 处理器

处理器类型

```typescript
export type Handler = (req: Request, res: Response) => any;
```

处理器定义

处理器定义在  `src/handler/*` 下，所有的处理器都必须定义为 `handler` 类型，在这里可以完成业务逻辑。

## 缓存

业务中 `access_token` 是存在过期时间的，因此缓存是强烈建议添加的逻辑。这里使用到的仅仅是内存缓存，建议开发者使用其它高速缓存如 [Redis](https://redis.io/) 等。

`oauth2Cache` 是用来缓存请求 [飞书Oauth2接口](https://open.feishu.cn/document/common-capabilities/sso/api/get-access_token) 的接口

`userCache` 是用来缓存[用户信息](https://open.feishu.cn/document/common-capabilities/sso/api/get-user-info)

```typescript
import {OauthTokenResponse, UserInfo} from "../model";

const oauth2Cache: Map<string, OauthTokenResponse> = new Map<string, OauthTokenResponse>();
const userCache: Map<string, UserInfo> = new Map<string, UserInfo>();

const defaultResponse: OauthTokenResponse = {
    access_token: "",
    expires_in: 0,
    refresh_expires_in: 0,
    refresh_token: "",
    scope: "",
    token_type: ""
};

const defaultUser: UserInfo = {name: "", picture: "", sub: "", tenant_key: ""};

export default {
    getOauth2RespById(uuid: string): OauthTokenResponse | undefined {
        if (oauth2Cache.has(uuid)) {
            return oauth2Cache.get(uuid);
        }
        return defaultResponse;
    },
    setOauth2(uuid: string, oauth: OauthTokenResponse | undefined = undefined) {
        oauth2Cache.set(uuid, oauth === undefined ? defaultResponse : oauth);
    },
    getUserById(uuid: string): UserInfo | undefined {
        if (userCache.has(uuid)) {
            return userCache.get(uuid);
        }
        return defaultUser;
    },
    setUser(uuid: string, user: UserInfo) {
        userCache.set(uuid, user === undefined ? defaultUser : user);
    },
    hasUser(uuid: string): boolean {
        return userCache.has(uuid);
    }
}
```

# License

- MIT
