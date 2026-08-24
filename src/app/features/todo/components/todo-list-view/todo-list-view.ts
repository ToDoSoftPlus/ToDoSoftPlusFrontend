import { Component, input } from '@angular/core';
import { TodoItemList } from '../todo-item-list/todo-item-list';
import { ToDoList } from '../../../../core/models/todos/todo-list/todo-list.model';

@Component({
  selector: 'app-todo-list-view',
  imports: [TodoItemList],
  templateUrl: './todo-list-view.html',
  styleUrl: './todo-list-view.scss',
})
export class TodoListView {
  toDoList = input.required<ToDoList>();
}
