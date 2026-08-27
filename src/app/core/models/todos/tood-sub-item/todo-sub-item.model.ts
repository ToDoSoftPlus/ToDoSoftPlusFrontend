import { ToDoItem } from "../todo-item/todo-item.model";

export interface ToDoSubItem {
    id: number,
    description: string,
    isCompleted: boolean,
    toDoItemId: number
    toDoItem: ToDoItem | null;
}

export interface CreateToDoSubItemRequest {
    description: string,
    isCompleted: boolean,
    toDoItemId: number
}

export interface UpdateToDoSubItemRequest {
    id: number,
    description: string,
    isCompleted: boolean,
    toDoItemId: number
}