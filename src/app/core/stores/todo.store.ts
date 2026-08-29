import { Injectable, signal } from "@angular/core";
import { ToDoItem } from "../models/todos/todo-item/todo-item.model";
import { ToDoSidebarList } from "../../features/todo/models/todo-sidebar-list.model";
import { ToDoListType } from "../models/todos/todo-list/todo-list.model";

@Injectable({
    providedIn: 'root'
})
export class TodoStore {

    private _sidebarLists = signal<ToDoSidebarList[]>([]);

    private _myDayListCountItems = signal<number>(0);
    private _importantListCountItems = signal<number>(0);
    private _taskListCountItems = signal<number>(0);

    private _selectedListId = signal<number | null>(null);
    private _selectedListType = signal<ToDoListType | null>(null);
    private _listChanged = signal<number>(0);

    private _selectedItem = signal<ToDoItem | null>(null);
    private _itemUpdated = signal<ToDoItem | null>(null);
    private _itemDeleted = signal<number>(0);

    readonly sidebarLists = this._sidebarLists.asReadonly();

    readonly myDayListCountItems = this._myDayListCountItems.asReadonly();
    readonly importantListCountItems = this._importantListCountItems.asReadonly();
    readonly taskListCountItems = this._taskListCountItems.asReadonly();

    readonly selectedListId = this._selectedListId.asReadonly();
    readonly selectedListType = this._selectedListType.asReadonly();
    readonly listChanged = this._listChanged.asReadonly();

    readonly selectedItem = this._selectedItem.asReadonly();
    readonly itemUpdated = this._itemUpdated.asReadonly();
    readonly itemDeleted = this._itemDeleted.asReadonly();

    setSidebarLists(lists: ToDoSidebarList[]): void {
        this._sidebarLists.set(lists);
    }

    setMyDayListCountItems(count: number): void {
        this._myDayListCountItems.set(count);
    }

    setImportantListCountItems(count: number): void {
        this._importantListCountItems.set(count);
    }

    setTaskListCountItems(count: number): void {
        this._taskListCountItems.set(count);
    }

    selectListId(listId: number | null): void {
        this._selectedListId.set(listId);
    }

    selectListType(listType: ToDoListType): void {
        this._selectedListType.set(listType);
    }

    selectItem(item: ToDoItem): void {
        this._selectedItem.set(item);
    }

    updateSidebarList(list: ToDoSidebarList): void {
        this._sidebarLists.update(lists =>
            lists.map(x =>
                x.id === list.id ? list : x
            )
        );
    }

    appendSidebarLists(lists: ToDoSidebarList[]): void {
        this._sidebarLists.update(current => [
            ...current,
            ...lists
        ]);
    }

    clearSidebarLists(): void {
        this._sidebarLists.set([]);
    }

    updateSidebarTitleList(id: number, title: string): void {
        this._sidebarLists.update(lists =>
            lists.map(x => x.id === id ? { ...x, title } : x)
        );
    }

    incrementSidebarItemCount(listId: number): void {
        this._sidebarLists.update(lists =>
            lists.map(x =>
                x.id === listId ? { ...x, countItems: x.countItems + 1 } : x
            )
        );
    }

    incrementMyDayListItemCount(): void {
        this._myDayListCountItems.update(count => count + 1);
    }

    incrementImportantListItemCount(): void {
        this._importantListCountItems.update(count => count + 1);
    }

    incrementTaskListItemCount(): void {
        this._taskListCountItems.update(count => count + 1);
    }

    decrementSidebarItemCount(listId: number): void {
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

    decrementMyDayListItemCount(): void {
        this._myDayListCountItems.update(count => count - 1);
    }

    decrementImportantListItemCount(): void {
        this._importantListCountItems.update(count => count - 1);
    }

    decrementTaskListItemCount(): void {
        this._taskListCountItems.update(count => count - 1);
    }

    notifyListChanged(): void {
        this._listChanged.update(x => x + 1);
    }

    notifyItemChanged(item: ToDoItem): void {
        this._itemUpdated.set(item);
        this._selectedItem.set(item);
    }

    notifyItemDeleted(): void {
        this._itemDeleted.update(x => x + 1);
        this.clearItem();
    }


    clearItem(): void {
        this._selectedItem.set(null);
    }
}