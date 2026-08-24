import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { TodoItemList } from '../todo-item-list/todo-item-list';
import { ToDoList } from '../../../../core/models/todos/todo-list/todo-list.model';
import { TodoListService } from '../../../../core/services/todo-list';

@Component({
  selector: 'app-todo-list-view',
  imports: [TodoItemList],
  templateUrl: './todo-list-view.html',
  styleUrl: './todo-list-view.scss',
})
export class TodoListView {
  toDoListId = input.required<number>();

  toDoListService = inject(TodoListService);

  toDoList = signal<ToDoList | undefined>(undefined);

  constructor() {
    effect(() => {
      const listId = this.toDoListId();

      this.loadList();
    })
  }

  loadList() {
    this.toDoListService.getListById(this.toDoListId()).subscribe({
      next: response => {
        this.toDoList.set(response);
      },
      error: error => {

      }
    })
  }
}
