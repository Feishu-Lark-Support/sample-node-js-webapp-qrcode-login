#  sample-node-js-webapp-qrcode-login

1. [概述](#概述)
2. [实现功能](#实现功能)
2. [运行环境](#运行环境)
3. [安装方法](#安装方法)
4. [快速使用](#快速使用)
4. [Docker](#Docker)
4. [更多信息](#更多信息)
4. [License](#License)

# 概述

​	在 README 之前，请保证先登录 [飞书开放平台](https://open.feishu.cn/) 并拥有一个企业自建应用/应用商店应用，他们的具体区别可见文档：[自建应用与商店应用](https://open.feishu.cn/document/home/app-types-introduction/self-built-apps-and-store-apps)。

​	创建并拥有飞书应用后，需要启用飞书应用的网页应用能力，可以参考文档 [快速集成网页应用](https://open.feishu.cn/document/home/integrating-web-apps-in-5-minutes/create-app-and-configuration)。当创建好网页应用后，为了让你的同事或其他人也能通过飞书账号登录到你的网页应用内，需要设置 [应用的可用性](https://open.feishu.cn/document/home/introduction-to-scope-and-authorization/availability)。

​	当你的网页应用需要飞书账号来授权登录时，并且希望可以在自己网页系统内部完成授权登录的流程，避免跳转到飞书登录页，保证流畅的体验，可以接入二维码 SDK 将飞书登录的二维码嵌入到网页中。

# 实现功能

- 可以扩展的 Node.js Webapp
- uuid 实现多用户的用户信息管理
- 在第三方系统通过飞书账号登录并获取用户信息

#	运行环境

- Node v12.22.3及以上

下载地址：[Node Download](https://nodejs.org/zh-cn/download/)

# 安装方法

- 在项目目录下，执行如下指令安装项目依赖

```shell
npm install
```

# 快速使用

1. 重命名 `.env.sample` 为 `.env`。

```shel
cp .env.sample .env
```

2. 分别替换变量 `CLIENT_ID`, `CLIENT_SECRET` , `REDIRECT_UR` 和 `DEFAULT_RUNTIME_IP` 的值。

- `CLIENT_ID` 和 `CLIENT_SECRET` 获取说明：[如何获取client_id和client_secret？](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/guide/faq#508869c1)
- `REDIRECT_URI` 是用于获取访问用户信息的 `access_token`，`access_token` 是开发者获取用户信息的唯一凭证。配置并获取重定向URL说明：[配置重定向URL](https://open.feishu.cn/document/uYjL24iN/uYjN3QjL2YzN04iN2cDN)
- `DEFAULT_RUNTIME_IP` 是服务默认访问 IP 地址

```typescript
// 示例值
CLIENT_ID=cli_xxxxx # 表示应用的 App_ID
CLIENT_SECRET=xxxxx # 表示应用的 App_Secret
REDIRECT_URI=http://127.0.0.1:9000/login
DEFAULT_RUNTIME_IP=127.0.0.1
```

2. 配置完信息后，在项目目录下执行如下命令

```sh
npm run dev
```

即可打印出服务中的路由信息，以及访问 Sample 的 URL 地址

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

# Docker

1. 确保你的电脑上可以正常运行 `Docker`，在命令行窗口输入 `docker --version` 验证，如未正常输出 docker 版本，请先按照安装指南先安装 docker：[Get Docker](https://docs.docker.com/get-docker/)
2. 按照 [上述步骤](#快速使用) 已经修改了 Sample 中的配置文件为 `.env`，并替换了其中变量的值
3. 如果你是 macOS/Linux 用户，可以在命令行窗口执行命令 `sh exec.sh` 即可将服务运行在 Docker 中；如果你是 Windows 用户，先打开 PowerShell 输入命令 `.\exec.ps1` 并执行就可以将服务运行在 Docker（如果无法直接执行，可以复制 `.\exec.ps1` 中的指令到 CMD 窗口逐行执行）。

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
