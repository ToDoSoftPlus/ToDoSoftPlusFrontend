import { Component, inject, OnInit, signal } from '@angular/core';
import { TodoSidebarList } from '../../components/todo-sidebar-list/todo-sidebar-list';
import { ToDoSidebarList } from '../../models/todo-sidebar-list.model';
import { TODO_LISTS } from '../../data/mock-todo.data';
import { TodoListView } from '../../components/todo-list-view/todo-list-view';
import { ToDoList } from '../../../../core/models/todos/todo-list.model';
import { AuthSevice } from '../../../../core/services/auth';
import { Router } from '@angular/router';
import { UserInfo } from '../../../../core/models/user/user-info.model';
import { TodoListService } from '../../../../core/services/todo-list';
import { PagedResponse } from '../../../../core/models/common/paged-response.model';

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [TodoSidebarList, TodoListView],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.scss',
})
export class TodoPage implements OnInit {
  authService = inject(AuthSevice);
  todoListService = inject(TodoListService);
  router = inject(Router);
  currentUser = signal<UserInfo | undefined | null>(undefined);

  toDoSidebarUserLists = signal<PagedResponse<ToDoSidebarList> | undefined | null>(undefined);

  page = signal<number>(1);
  private pageSize = 10;

  async ngOnInit(): Promise<void> {
    this.currentUser.set(await this.authService.getCurrentUserInfo());

    await this.todoListService.getUserSidebarLists({
      page: this.page(), pageSize: this.pageSize
    }).subscribe({
      next: response => {
        this.toDoSidebarUserLists.set(response);
      }
    });
  }

  currentListId: number = 1;

  currentList: ToDoList = TODO_LISTS.find(list => list.id) ?? TODO_LISTS[0];

  toDoSidebarSystemLists: ToDoSidebarList[] = [
    { id: 1, title: "list1-s", countItems: 1 },
    { id: 2, title: "list2-s", countItems: 10 },
    { id: 3, title: "list3-s", countItems: 100 },
  ]

  exitButtonClickHandler() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  };
}
