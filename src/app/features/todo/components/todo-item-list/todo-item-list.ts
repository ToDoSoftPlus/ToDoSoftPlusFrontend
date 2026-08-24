import { Component, input } from '@angular/core';
import { ToDoItem } from '../../../../core/models/todos/todo-item/todo-item.model';

@Component({
  selector: 'app-todo-item-list',
  imports: [],
  templateUrl: './todo-item-list.html',
  styleUrl: './todo-item-list.scss',
})
export class TodoItemList {
  toDoItem = input.required<ToDoItem>();
}
