import { Component, input, output } from '@angular/core';
import { ToDoSidebarList } from '../../models/todo-sidebar-list.model';
import { ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-todo-sidebar-list',
  imports: [ReactiveFormsModule],
  templateUrl: './todo-sidebar-list.html',
  styleUrl: './todo-sidebar-list.scss',
})
export class TodoSidebarList {
  toDoSidebarList = input.required<ToDoSidebarList>();
  isActive = input<boolean>(false);
  onListClick = output<void>();
}
