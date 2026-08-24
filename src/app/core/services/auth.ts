import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { AuthResponse } from '../models/auth/auth-response.model';
import { RegisterRequest } from '../../features/user/models/register.model';
import { LoginRequest } from '../../features/user/models/login.model';
import { UserInfo } from '../models/user/user-info.model';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.local';

@Injectable({
    providedIn: "root"
})
export class AuthSevice {

    private apiUrl = environment.apiUrl;
    private currentUser = signal<UserInfo | undefined | null>(undefined);

    constructor(private http: HttpClient) { }

    register(request: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(
            `${this.apiUrl}/v1/auth/register`,
            request
        ).pipe(
            tap(response => {
                this.setAccessToken(response.accessToken, response.accessTokenExpiresAt);
                this.currentUser.set(response.userInfo);
            })
        );
    }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(
            `${this.apiUrl}/v1/auth/login`,
            request
        ).pipe(
            tap(response => {
                this.setAccessToken(response.accessToken, response.accessTokenExpiresAt);
                this.currentUser.set(response.userInfo);
            })
        );
    }

    logout(): void {
        localStorage.removeItem("access_token");
        localStorage.removeItem("access_token_expire");
        this.currentUser.set(null);
    }

    getCurrentUserInfo(): UserInfo | null | undefined {
        const currentUser = this.currentUser();

        if (currentUser) {
            return currentUser;
        }

        const token = this.getToken();

        if (!token) {
            return null;
        }

        this.http.get<UserInfo>(`${this.apiUrl}/v1/user/me`, { withCredentials: true }).subscribe({
            next: response => {
                this.currentUser.set(response);
            }
        })

        return currentUser;
    }

    isAuthenticated(): boolean {
        const access_token = this.getToken();
        const access_token_expire = localStorage.getItem("access_token_expire");

        if (!access_token || !access_token_expire) {
            return false;
        }

        return new Date(access_token_expire).getTime() > Date.now();
    }

    private setAccessToken(accessToken: string, expiresAt: string): void {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("access_token_expire", expiresAt);
    }

    getToken(): string | null {
        return localStorage.getItem("access_token");
    }
}
