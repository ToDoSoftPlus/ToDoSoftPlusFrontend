import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { TodoSidebarList } from '../../components/todo-sidebar-list/todo-sidebar-list';
import { ToDoSidebarList } from '../../models/todo-sidebar-list.model';
import { TodoListView } from '../../components/todo-list-view/todo-list-view';
import { AuthSevice } from '../../../../core/services/auth';
import { Router } from '@angular/router';
import { UserInfo } from '../../../../core/models/user/user-info.model';
import { TodoListService } from '../../../../core/services/todo-list';
import { PagedResponse } from '../../../../core/models/common/paged-response.model';
import { CreateToDoListRequest, ToDoList } from '../../../../core/models/todos/todo-list/todo-list.model';
import { ErrorResponse } from '../../../../core/models/common/error-response.model';
import { StatusNotificationData } from '../../../../shared/models/status-notification.model';
import { StatusNotification } from "../../../../shared/components/status-notification/status-notification";
import { CreateToDoSidebarList } from '../../components/create-todo-sidebar-list/create-todo-sidebar-list';
import { CreateToDoSidebarListModel } from '../../models/create-todo-sidebar-list.model';

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [TodoSidebarList, CreateToDoSidebarList, TodoListView, StatusNotification],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.scss',
})
export class TodoPage implements OnInit {
  authService = inject(AuthSevice);
  todoListService = inject(TodoListService);
  router = inject(Router);
  statusNotification = signal<StatusNotificationData | null>(null);

  currentUser = signal<UserInfo | undefined | null>(undefined);
  sidebarListResponse = signal<PagedResponse<ToDoSidebarList> | undefined | null>(undefined);
  sidebarListEditingListId = signal<number>(-1);
  currentSidebarListId = signal<number | undefined>(undefined);
  isCreateSidebarList = signal<boolean>(false);

  page = signal<number>(1);
  private pageSize = 10;

  toDoSidebarSystemLists: ToDoSidebarList[] = [
    { id: 1, title: "list1-s", countItems: 1 },
    { id: 2, title: "list2-s", countItems: 10 },
    { id: 3, title: "list3-s", countItems: 100 },
  ]

  async ngOnInit(): Promise<void> {
    this.currentUser.set(await this.authService.getCurrentUserInfo());
    this.loadLists(true);
  }

  loadLists(selectedFirst = false): void {
    this.todoListService.getUserSidebarLists({
      page: this.page(), pageSize: this.pageSize
    }).subscribe({
      next: response => {
        this.sidebarListResponse.set(response);

        if (selectedFirst) {
          this.currentSidebarListId.set(response.items[0].id);
        }
      }
    });
  };

  onUserExitButtonClick() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  };

  onCreateList(): void {
    this.isCreateSidebarList.set(true);
  }

  onCreateListSubmit(model: CreateToDoSidebarListModel): void {
    const request: CreateToDoListRequest = {
      title: model.title,
      description: null
    };

    this.todoListService.createList(request).subscribe({
      next: response => {
        this.loadLists(false);
        this.isCreateSidebarList.set(false);
      },
      error: error => {
        this.onCreateListCancel();
        const errorResponse = error.error as ErrorResponse;
        this.statusNotification.set({
          type: 'error',
          message: errorResponse.Message,
          errors: errorResponse.Errors,
        });
      }
    })
  }

  onCreateListCancel(): void {
    this.isCreateSidebarList.set(false);
  }

  onListClick(listId: number) {
    this.currentSidebarListId.set(listId);
  }

  onListDelete(listId: number) {
    this.todoListService.deleteList(listId).subscribe({
      next: response => {
        this.loadLists(true);
      }
    });
  }

  onListEdit(list: ToDoList) {

  }
}
