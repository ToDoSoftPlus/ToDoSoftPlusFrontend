import { ToDoItem } from "./todo-item.model";

export interface ToDoList {
    id: number,
    title: string,
    description: string | null,
    createdAt: number,
    updatedetAt: number,
    userId: number,
    toDoItems: Array<ToDoItem> | null
}