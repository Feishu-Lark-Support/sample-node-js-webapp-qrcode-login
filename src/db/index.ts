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
    // 无缓存
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