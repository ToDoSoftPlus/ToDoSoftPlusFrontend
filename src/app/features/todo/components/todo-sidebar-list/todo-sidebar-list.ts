import { Component, inject, input, output } from '@angular/core';
import { ToDoSidebarList } from '../../models/todo-sidebar-list.model';
import { ReactiveFormsModule} from '@angular/forms';
import { TodoStore } from '../../../../core/stores/todo.store';
import { ToDoListType } from '../../../../core/models/todos/todo-list/todo-list.model';

@Component({
  selector: 'app-todo-sidebar-list',
  imports: [ReactiveFormsModule],
  templateUrl: './todo-sidebar-list.html',
  styleUrl: './todo-sidebar-list.scss',
})
export class TodoSidebarList {
  toDoSidebarList = input.required<ToDoSidebarList>();  
  todoStore = inject(TodoStore);

  onSidebarClick(): void {
    
    this.todoStore.selectListId(this.toDoSidebarList().id);

    switch (this.toDoSidebarList().id) {
      case -1: this.todoStore.selectListType(ToDoListType.MyDay); break;
      case -2: this.todoStore.selectListType(ToDoListType.Important); break;
      case -3: this.todoStore.selectListType(ToDoListType.Task); break;
      default: this.todoStore.selectListType(ToDoListType.Regular); break;
    }
  }
}
