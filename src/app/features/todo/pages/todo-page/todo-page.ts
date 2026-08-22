import { Component, inject, OnInit, signal } from '@angular/core';
import { TodoSidebarList } from '../../components/todo-sidebar-list/todo-sidebar-list';
import { ToDoSidebarList } from '../../models/todo-sidebar-list.model';
import { TODO_LISTS } from '../../data/mock-todo.data';
import { TodoListView } from '../../components/todo-list-view/todo-list-view';
import { ToDoList } from '../../../../core/models/todos/todo-list.model';
import { AuthSevice } from '../../../../core/services/auth';
import { Router } from '@angular/router';
import { UserInfo } from '../../../../core/models/user/user-info.model';

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [TodoSidebarList, TodoListView],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.scss',
})
export class TodoPage implements OnInit {
  authService = inject(AuthSevice);
  router = inject(Router);
  currentUser = signal<UserInfo | undefined | null>(undefined);

  async ngOnInit(): Promise<void> {
    this.currentUser.set(await this.authService.getCurrentUserInfo());
  }

  currentListId: number = 1;

  currentList: ToDoList = TODO_LISTS.find(list => list.id) ?? TODO_LISTS[0];

  toDoSidebarSystemLists: ToDoSidebarList[] = [
    { id: 1, title: "list1-s", countItems: 1, imageUrl: undefined },
    { id: 2, title: "list2-s", countItems: 10, imageUrl: undefined },
    { id: 3, title: "list3-s", countItems: 100, imageUrl: undefined },
  ]

  toDoSidebarUserLists: ToDoSidebarList[] = TODO_LISTS.map(list => ({
    id: list.id,
    title: list.title,
    countItems: list.toDoItems?.length ?? 0,
    imageUrl: undefined
  }));

  exitButtonClickHandler() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  };
}
