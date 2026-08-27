import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateToDoSubItemRequest, ToDoSubItem, UpdateToDoSubItemRequest } from '../models/todos/tood-sub-item/todo-sub-item.model';
import { environment } from '../../../environments/environment';
import { UpdateToDoItemRequest } from '../models/todos/todo-item/todo-item.model';

@Injectable({
    providedIn: 'root'
})
export class TodoSubItemService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {};

    createSubItem(request: CreateToDoSubItemRequest): Observable<ToDoSubItem> {
        return this.http.post<ToDoSubItem>(`${this.apiUrl}/v1/todo-sub-item`, request);
    }

    updateSubItem(request: UpdateToDoSubItemRequest): Observable<ToDoSubItem> {
        return this.http.put<ToDoSubItem>(`${this.apiUrl}/v1/todo-sub-item`, request);
    }

    deleteSubItem(subItemId: number) {
        return this.http.delete(`${this.apiUrl}/v1/todo-sub-item/${subItemId}`);
    }

    getSubItemsInItem(itemId: number): Observable<ToDoSubItem[]> {
        return this.http.get<ToDoSubItem[]>(`${this.apiUrl}/v1/todo-sub-item/item/${itemId}`);
    }
}
