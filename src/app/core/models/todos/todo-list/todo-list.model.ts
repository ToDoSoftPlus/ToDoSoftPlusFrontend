import { ToDoItem } from "../todo-item/todo-item.model";

export interface ToDoList {
    id: number,
    title: string,
    description: string | null,
    createdAt: number,
    updatedetAt: number,
    userId: number,
    toDoItemsList: Array<ToDoItem> | null
}

export interface CreateToDoListRequest {
    title: string,
    description: string | null,
}