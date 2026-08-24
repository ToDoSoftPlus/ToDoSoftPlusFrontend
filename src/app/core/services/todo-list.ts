import { Injectable, Service } from '@angular/core';
import { environment } from '../../../environments/environment.local';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PagedResponse } from '../models/common/paged-response.model';
import { PaginationRequest } from '../models/common/pagination-request.model';
import { ToDoSidebarList } from '../../features/todo/models/todo-sidebar-list.model';
import { CreateToDoListRequest, ToDoList } from '../models/todos/todo-list/todo-list.model';

@Injectable({
    providedIn: "root"
})
export class TodoListService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getUserSidebarLists(paginationRequest: PaginationRequest): Observable<PagedResponse<ToDoSidebarList>> {
        const params = new HttpParams()
            .set('page', paginationRequest.page)
            .set('pageSize', paginationRequest.pageSize);

        return this.http.get<PagedResponse<ToDoSidebarList>>(
            `${this.apiUrl}/v1/todo-list/sidebar`,
            { params: params }
        )
    }
    
    createList(request: CreateToDoListRequest): Observable<ToDoList> {
        return this.http.post<ToDoList>(
            `${this.apiUrl}/v1/todo-list`,
            request
        );
    }

    getListById(id: number): Observable<ToDoList> {
        return this.http.get<ToDoList>(`${this.apiUrl}/v1/todo-list/${id}`);
    }
}
