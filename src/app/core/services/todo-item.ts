import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CreateToDoItemRequest, ToDoItem } from '../models/todos/todo-item/todo-item.model';
import { Observable } from 'rxjs';
import { PaginationRequest } from '../models/common/pagination-request.model';
import { PagedResponse } from '../models/common/paged-response.model';

@Injectable({
    providedIn: "root"
})
export class TodoItemService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    createItem(request: CreateToDoItemRequest): Observable<ToDoItem> {
        return this.http.post<ToDoItem>(
            `${this.apiUrl}/v1/todo-item`,
            request
        );
    }

    getItemsInList(listId: number, request: PaginationRequest): Observable<PagedResponse<ToDoItem>> {
        const params = new HttpParams()
            .set('page', request.page)
            .set('pageSize', request.pageSize);

        return this.http.get<PagedResponse<ToDoItem>>(
            `${this.apiUrl}/v1/todo-item/list/${listId}`,
            { params: params}
        );
    }
}
