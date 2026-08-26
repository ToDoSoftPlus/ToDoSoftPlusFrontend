import { ToDoSubItem } from "../tood-sub-item/todo-sub-item.model";

export interface ToDoItem {
    id: number,
    title: string,
    description: string | null,
    isImportant: boolean,
    isCompleted: boolean,
    createdAt: string,
    updatedAt: string,
    completedAt: string | null,
    toDoListId: number,
    toDoSubItems: Array<ToDoSubItem> | null
}

export interface CreateToDoItemRequest {
    title: string,
    description: string | null,
    isImportant: boolean,
    isCompleted: boolean,
    completedAt: Date | null,
    toDoListId: number
}

export interface UpdateToDoItemRequest {
    id: number,
    title: string,
    description: string,
    isImportant: boolean,
    isCompleted: boolean,
    completedAt: Date | null,
    toDoListId: number
}