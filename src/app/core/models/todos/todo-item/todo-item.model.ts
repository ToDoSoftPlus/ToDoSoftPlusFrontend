import { ToDoSubItem } from "../tood-sub-item/todo-sub-item.model";

export interface ToDoItem {
    id: number,
    title: string,
    description: string | null,
    isMyDay: boolean,
    isImportant: boolean,
    isCompleted: boolean,
    createdAt: string,
    updatedAt: string,
    completedAt: string | null,
    toDoListId: number | null,
    subToDoItems: Array<ToDoSubItem> | null
}

export interface CreateToDoItemRequest {
    title: string,
    description: string | null,
    isMyDay: boolean,
    isImportant: boolean,
    isCompleted: boolean,
    completedAt: Date | null,
    toDoListId: number | null
}

export interface UpdateToDoItemRequest {
    id: number,
    title: string,
    description: string,
    isMyDay: boolean,
    isImportant: boolean,
    isCompleted: boolean,
    completedAt: Date | null,
    toDoListId: number | null,
}