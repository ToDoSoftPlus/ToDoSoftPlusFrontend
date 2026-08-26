import { Injectable, signal } from "@angular/core";
import { ToDoItem } from "../models/todos/todo-item/todo-item.model";
import { ToDoSidebarList } from "../../features/todo/models/todo-sidebar-list.model";

@Injectable({
    providedIn: 'root'
})
export class TodoStore {

    private _sidebarLists = signal<ToDoSidebarList[]>([]);
    private _selectedItem = signal<ToDoItem | null>(null);
    private _selectedListId = signal<number | null>(null);
    private _listChanged = signal<number>(0);

    readonly sidebarLists = this._sidebarLists.asReadonly();
    readonly selectedItem = this._selectedItem.asReadonly();
    readonly selectedListId = this._selectedListId.asReadonly();
    readonly listChanged = this._listChanged.asReadonly();

    setSidebarLists(lists: ToDoSidebarList[]): void {
        this._sidebarLists.set(lists);
    }

    updateSidebarList(list: ToDoSidebarList): void {
        this._sidebarLists.update(lists =>
            lists.map(x =>
                x.id === list.id ? list : x
            )
        );
    }

    updateSidebarTitleList(id: number, title: string): void {
        this._sidebarLists.update(lists =>
            lists.map(x => x.id === id ? { ...x, title } : x)
        );
    }

    incrementItemCount(listId: number): void {
        this._sidebarLists.update(lists =>
            lists.map(x =>
                x.id === listId ? { ...x, countItems: x.countItems + 1 } : x
            )
        );
    }

    decrementItemCount(listId: number): void {
        this._sidebarLists.update(lists =>
            lists.map(x =>
                x.id === listId
                    ? {
                        ...x,
                        countItems: Math.max(0, x.countItems - 1)
                    }
                    : x
            )
        );
    }

    notifyListChanged(): void {
        this._listChanged.update(x => x + 1);
    }

    selectItem(item: ToDoItem): void {
        this._selectedItem.set(item);
    }

    clearItem(): void {
        this._selectedItem.set(null);
    }

    selectListId(listId: number | null): void {
        this._selectedListId.set(listId);
    }
}