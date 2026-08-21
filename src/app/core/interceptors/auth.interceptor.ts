import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthSevice } from "../services/auth";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthSevice);

    if (!authService.isAuthenticated()) {
        return next(req);
    }
    
    const token = authService.getToken();

    if (!token) {
        return next(req);
    }

    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });

    return next(authReq);
}