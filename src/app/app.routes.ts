import { Routes } from '@angular/router';
import { TodoPage } from './features/todo/pages/todo-page/todo-page';
import { RegisterPage } from './features/user/pages/register-page/register-page';
import { LoginPage } from './features/user/pages/login-page/login-page';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: TodoPage,
        title: "Todo page",
        canActivate: [authGuard]
    },
    {
        path: "register",
        component: RegisterPage,
        title: "Register page"
    },
    {
        path: "login",
        component: LoginPage,
        title: "Login page"
    }
];
