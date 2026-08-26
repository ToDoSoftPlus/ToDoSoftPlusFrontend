import { Component, inject, input, output } from '@angular/core';
import { ToDoSidebarList } from '../../models/todo-sidebar-list.model';
import { ReactiveFormsModule} from '@angular/forms';
import { TodoStore } from '../../../../core/stores/todo.store';

@Component({
  selector: 'app-todo-sidebar-list',
  imports: [ReactiveFormsModule],
  templateUrl: './todo-sidebar-list.html',
  styleUrl: './todo-sidebar-list.scss',
})
export class TodoSidebarList {
  toDoSidebarList = input.required<ToDoSidebarList>();  
  todoStore = inject(TodoStore);
}
