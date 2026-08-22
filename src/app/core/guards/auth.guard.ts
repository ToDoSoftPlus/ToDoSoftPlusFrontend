import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthSevice } from "../services/auth";

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthSevice);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    return router.createUrlTree(["/login"]);
}