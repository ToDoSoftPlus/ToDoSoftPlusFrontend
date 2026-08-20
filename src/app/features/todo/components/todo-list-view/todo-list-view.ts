import { Component, input } from '@angular/core';
import { ToDoList } from '../../../../core/models/todo-list.model';
import { TodoItemList } from '../todo-item-list/todo-item-list';

@Component({
  selector: 'app-todo-list-view',
  imports: [TodoItemList],
  templateUrl: './todo-list-view.html',
  styleUrl: './todo-list-view.scss',
})
export class TodoListView {
  toDoList = input.required<ToDoList>();
}
