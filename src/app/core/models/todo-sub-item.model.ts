import { ToDoItem } from "./todo-item.model"

export interface ToDoSubItem {
    id: number,
    description: string,
    isCompleted: boolean,
    toDoItemId: number
    toDoItem: ToDoItem | null;
}