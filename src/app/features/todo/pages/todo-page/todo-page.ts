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

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [TodoSidebarList, TodoListView, StatusNotification],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.scss',
})
export class TodoPage implements OnInit {
  authService = inject(AuthSevice);
  todoListService = inject(TodoListService);
  router = inject(Router);
  statusNotification = signal<StatusNotificationData | null>(null);

  currentUser = signal<UserInfo | undefined | null>(undefined);
  toDoSidebarUserResponse = signal<PagedResponse<ToDoSidebarList> | undefined | null>(undefined);
  toDoSidebarEditingListId = signal<number>(-1);
  toDoCurrentSidebarListId = signal<number | undefined>(undefined);

  page = signal<number>(1);
  private pageSize = 10;

  toDoSidebarSystemLists: ToDoSidebarList[] = [
    { id: 1, title: "list1-s", countItems: 1 },
    { id: 2, title: "list2-s", countItems: 10 },
    { id: 3, title: "list3-s", countItems: 100 },
  ]

  ngOnInit(): void {
    this.loadLists(true);
  }

  loadLists(selectedFirst = false): void {
    this.currentUser.set(this.authService.getCurrentUserInfo());

    this.todoListService.getUserSidebarLists({
      page: this.page(), pageSize: this.pageSize
    }).subscribe({
      next: response => {
        this.toDoSidebarUserResponse.set(response);

        if (selectedFirst) {
          this.toDoCurrentSidebarListId.set(response.items[0].id);
        }
      }
    });
  };

  exitButtonClickHandler() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  };

  createTempSidebarList() {
    const tempList: ToDoSidebarList = {
      id: -Date.now(),
      title: '',
      countItems: 0
    };

    this.toDoSidebarUserResponse.update(response => {
      if (!response)
        return response;

      this.toDoSidebarEditingListId.set(tempList.id);

      const newTotalCount = response.totalCount + 1;
      const items = [
        ...response.items,
        tempList
      ].slice(0, response.pageSize);

      return {
        ...response,
        items,
        totalCount: newTotalCount,
        totalPages: Math.ceil(newTotalCount / response.pageSize),
        hasNext: response.page < Math.ceil(
          newTotalCount / response.pageSize
        ),
        hasPrevious: response.page > 1
      };
    })
  }

  saveTempSidebarList(list: ToDoSidebarList, title: string) {
    const request: CreateToDoListRequest = {
      title: title.trim(),
      description: null
    };

    this.todoListService.createList(request).subscribe({
      next: (response: ToDoList) => {
        this.toDoSidebarUserResponse.update(listResponse => {
          if (!listResponse) {
            return listResponse;
          }

          this.toDoSidebarEditingListId.set(-1);

          return {
            ...listResponse,

            items: listResponse.items.map(item =>
              item.id === list.id
                ? {
                  ...item,
                  id: response.id,
                  title: response.title,
                  countItems: 0
                }
                : item
            )
          };
        })
      },
      error: error => {
        this.cancelTempSidebarList(list);
        const errorResponse = error.error as ErrorResponse;
        this.statusNotification.set({
          type: 'error',
          message: errorResponse.Message,
          errors: errorResponse.Errors,
        });
      }
    })
  }

  cancelTempSidebarList(list: ToDoSidebarList) {
    this.toDoSidebarUserResponse.update(listResponse => {
      if (!listResponse) {
        return listResponse;
      }

      return {
        ...listResponse,
        items: listResponse.items.filter(
          item => item.id !== list.id
        )
      };
    });
  }

  listClick(listId: number) {
    this.toDoCurrentSidebarListId.set(listId);
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
