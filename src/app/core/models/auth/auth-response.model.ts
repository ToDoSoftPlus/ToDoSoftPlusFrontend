import { UserInfo } from "../user/user-info.model"

export interface AuthResponse {
    userInfo: UserInfo,
    accessToken: string,
    accessTokenExpiresAt: string
}