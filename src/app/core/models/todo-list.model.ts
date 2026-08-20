import { ToDoItem } from "./todo-item.model";

export interface ToDoList {
    id: number,
    title: string,
    description: string | null,
    createdAt: Date,
    updatedetAt: Date,
    userId: number,
    toDoItems: Array<ToDoItem>
}