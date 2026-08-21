import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthSevice } from "../services/auth";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthSevice) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();

        if (!token){
            return next.handle(req);
        }

        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        return next.handle(authReq);
    }
}