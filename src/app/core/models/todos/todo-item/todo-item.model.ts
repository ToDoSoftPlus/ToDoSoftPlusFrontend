import { ToDoSubItem } from "../tood-sub-item/todo-sub-item.model";

export interface ToDoItem {
    id: number,
    title: string,
    description: string | null,
    isImportant: boolean,
    isCompleted: boolean,
    createdAt: number,
    updatedAt: number,
    completedAt: number | null,
    toDoListId: number,
    toDoSubItems: Array<ToDoSubItem> | null
}