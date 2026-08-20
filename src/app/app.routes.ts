import { Routes } from '@angular/router';
import { TodoPage } from './features/todo/pages/todo-page/todo-page';

export const routes: Routes = [
    {
        path: '',
        component: TodoPage,
        title: "Todo page"
    }
];
