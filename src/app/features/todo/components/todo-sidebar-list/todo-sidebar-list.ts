import { Component, Input, input } from '@angular/core';
import { ToDoSidebarList } from '../../models/todo-sidebar-list.model';

@Component({
  selector: 'app-todo-sidebar-list',
  imports: [],
  templateUrl: './todo-sidebar-list.html',
  styleUrl: './todo-sidebar-list.css',
})
export class TodoSidebarList {
  toDoSidebarList = input.required<ToDoSidebarList>();
}
