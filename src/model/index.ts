export interface UserInfo {
    sub: string;
    name: string;
    picture: string;
    tenant_key: string;
}

export interface OauthTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    refresh_expires_in: number;
    scope: string;
}
