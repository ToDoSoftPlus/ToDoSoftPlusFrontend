import { ToDoSubItem } from "./todo-sub-item.model";

export interface ToDoItem {
    id: number,
    title: string,
    description: string,
    isImportant: boolean,
    isCompleted: boolean,
    createdAt: Date,
    updatedAt: Date,
    completedAt: Date,
    toDoListId: number,
    toDoSubItems: Array<ToDoSubItem>
}