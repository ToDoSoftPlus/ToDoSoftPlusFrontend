import { Component } from '@angular/core';
import { TodoSidebarList } from '../../components/todo-sidebar-list/todo-sidebar-list';
import { ToDoSidebarList } from '../../models/todo-sidebar-list.model';

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [TodoSidebarList],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.css',
})
export class TodoPage {
  toDoSidebarSystemLists: ToDoSidebarList[] = [
    { id: 1, title: "list1-s", countItems: 1, imageUrl: undefined},
    { id: 2, title: "list2-s", countItems: 10, imageUrl: undefined},
    { id: 3, title: "list3-s", countItems: 100, imageUrl: undefined},
  ]

  toDoSidebarUserLists: ToDoSidebarList[] = [
    { id: 1, title: "list1", countItems: 25, imageUrl: undefined},
    { id: 2, title: "list2", countItems: 999, imageUrl: undefined},
    { id: 3, title: "list3", countItems: 1000, imageUrl: undefined},
  ]
}
