export interface LoginResponse {
    authToken: string;
    expireAt: Date;
    refreshToken: string;
    username: string;
}