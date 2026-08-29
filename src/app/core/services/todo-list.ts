import { Injectable, Service } from '@angular/core';
import { environment } from '../../../environments/environment.local';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PagedResponse } from '../models/common/paged-response.model';
import { PaginationRequest } from '../models/common/pagination-request.model';
import { ToDoSidebarList } from '../../features/todo/models/todo-sidebar-list.model';
import { CreateToDoListRequest, ToDoList, UpdateToDoListRequest } from '../models/todos/todo-list/todo-list.model';
import { FilterListsRequest } from '../models/common/filtering-list-request.model';

@Injectable({
    providedIn: "root"
})
export class TodoListService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getUserSidebarLists(paginationRequest: PaginationRequest, filterListsRequest: FilterListsRequest | null): Observable<PagedResponse<ToDoSidebarList>> {
        let params = new HttpParams()
            .set('page', paginationRequest.page)
            .set('pageSize', paginationRequest.pageSize);

        if (filterListsRequest !== null) {
            if (filterListsRequest.startDate) {
                params = params.set('startDate', filterListsRequest.startDate);
            }

            if (filterListsRequest.endDate) {
                params = params.set('endDate', filterListsRequest.endDate);
            }
        }

        return this.http.get<PagedResponse<ToDoSidebarList>>(
            `${this.apiUrl}/v1/todo-list/sidebar`,
            { params: params }
        )
    }

    searchSidebarLists(title: string, paginationRequest: PaginationRequest, filterListsRequest: FilterListsRequest | null): Observable<PagedResponse<ToDoSidebarList>> {
        let params = new HttpParams()
            .set('page', paginationRequest.page)
            .set('pageSize', paginationRequest.pageSize)
            .set('title', title);

        if (filterListsRequest !== null) {
            if (filterListsRequest.startDate) {
                params = params.set('startDate', filterListsRequest.startDate);
            }

            if (filterListsRequest.endDate) {
                params = params.set('endDate', filterListsRequest.endDate);
            }
        }

        return this.http.get<PagedResponse<ToDoSidebarList>>(
            `${this.apiUrl}/v1/todo-list/sidebar/search`,
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

    deleteList(id: number) {
        return this.http.delete(`${this.apiUrl}/v1/todo-list/${id}`);
    }

    updateList(request: UpdateToDoListRequest): Observable<ToDoList> {
        return this.http.put<ToDoList>(
            `${this.apiUrl}/v1/todo-list`,
            request
        );
    }
}
