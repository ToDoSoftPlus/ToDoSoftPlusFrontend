import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { AuthResponse } from '../models/auth/auth-response.model';
import { RegisterRequest } from '../../features/user/models/register.model';
import { LoginRequest } from '../../features/user/models/login.model';
import { UserInfo } from '../models/user/user-info.model';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.local';

@Injectable({
    providedIn: "root"
})
export class AuthSevice {

    private apiUrl = environment.apiUrl;
    private currentUser = signal<UserInfo | undefined | null>(undefined);

    constructor(private http: HttpClient) { }

    register(request: RegisterRequest): void {
        this.http.post<AuthResponse>(
            `${this.apiUrl}/v1/register`,
            request
        ).subscribe({
            next: response => {
                this.setAccessToken(response.accessToken, response.expiresAt);
                this.currentUser.set(response.userInfo);
            },
            error: error => console.log(error)
        });
    }

    login(request: LoginRequest): void {
        this.http.post<AuthResponse>(
            `${this.apiUrl}/v1/login`,
            request
        ).subscribe({
            next: response => {
                this.setAccessToken(response.accessToken, response.expiresAt);
                this.currentUser.set(response.userInfo);
            },
            error: error => console.log(error)
        })
    }

    logout(): void {
        localStorage.removeItem("access_token");
        localStorage.removeItem("access_token_expire");
        this.currentUser.set(null);
    }

    getToken(): string | null {
        return localStorage.getItem("access_token");
    }

    async getCurrentUserInfo(): Promise<UserInfo | null | undefined> {
        if (this.currentUser() == null || this.currentUser() == undefined) {
            const token = this.getToken();

            if (!token) {
                return null;
            }

            const user = await firstValueFrom(
                this.http.get<UserInfo>(`${this.apiUrl}/v1/user/me`)
            );

            this.currentUser.set(user);
        }

        return this.currentUser();
    }

    isAuthenticated(): boolean {
        if (this.getToken() == null) {
            return false;
        }
        
        return true
    }

    private setAccessToken(accessToken: string, expiresAt: string): void {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("access_token_expire", expiresAt);
    }
}
