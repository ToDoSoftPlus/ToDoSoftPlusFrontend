import { Component, computed, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { TodoSidebarList } from '../../components/todo-sidebar-list/todo-sidebar-list';
import { ToDoSidebarList } from '../../models/todo-sidebar-list.model';
import { TodoListView } from '../../components/todo-list-view/todo-list-view';
import { AuthSevice } from '../../../../core/services/auth';
import { Router } from '@angular/router';
import { UserInfo } from '../../../../core/models/user/user-info.model';
import { TodoListService } from '../../../../core/services/todo-list';
import { CreateToDoListRequest, ToDoList, ToDoListType } from '../../../../core/models/todos/todo-list/todo-list.model';
import { ErrorResponse } from '../../../../core/models/common/error-response.model';
import { StatusNotificationData } from '../../../../shared/models/status-notification.model';
import { StatusNotification } from "../../../../shared/components/status-notification/status-notification";
import { CreateToDoSidebarList } from '../../components/create-todo-sidebar-list/create-todo-sidebar-list';
import { CreateToDoSidebarListModel } from '../../models/create-todo-sidebar-list.model';
import { TodoStore } from '../../../../core/stores/todo.store';
import { TodoItemView } from '../../components/todo-item-view/todo-item-view';
import { TodoItemService } from '../../../../core/services/todo-item';
import { form, FormField, required } from '@angular/forms/signals';

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [TodoSidebarList, CreateToDoSidebarList, TodoListView, TodoItemView, StatusNotification, FormField],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.scss',
})
export class TodoPage implements OnInit {
  authService = inject(AuthSevice);
  todoListService = inject(TodoListService);
  todoItemService = inject(TodoItemService);
  router = inject(Router);
  todoStore = inject(TodoStore);
  statusNotification = signal<StatusNotificationData | null>(null);

  currentUser = signal<UserInfo | undefined | null>(undefined);
  isCreateSidebarList = signal<boolean>(false);

  isLoadingLists = signal<boolean>(false);
  page = signal<number>(1);
  private pageSize = 7;
  totalCount = signal(0);
  totalPages = signal(0);
  hasNext = signal(false);
  hasPrevious = signal(false);

  myDaySidebarList = computed<ToDoSidebarList>(() => ({
    id: -1,
    title: "My Day",
    countItems: this.todoStore.myDayListCountItems()
  }));

  importantSidebarList = computed<ToDoSidebarList>(() => ({
    id: -2,
    title: 'Important',
    countItems: this.todoStore.importantListCountItems()
  }));

  taskSidebarList = computed<ToDoSidebarList>(() => ({
    id: -3,
    title: 'Task',
    countItems: this.todoStore.taskListCountItems()
  }));

  isSearching = signal<boolean>(false);
  searchModel = signal({
    search: ''
  });

  searchForm = form(this.searchModel, (schema) => {
    required(schema.search);
  });

  async ngOnInit(): Promise<void> {
    this.currentUser.set(await this.authService.getCurrentUserInfo());
    this.loadMyDayCountItems();
    this.loadImportantCountItems();
    this.loadTaskCountItems();
  }

  constructor() {
    effect(() => {
      this.todoStore.listChanged();

      untracked(() => {
        this.loadLists(true);
      })
    })

    effect(() => {
      const currentListId = this.todoStore.selectedListId();

      if (currentListId === null) {
        return;
      }

      this.todoStore.clearItem();
    })
  }

  loadLists(isFirstPage: boolean): void {
    if (this.isLoadingLists()) return;
    if (!isFirstPage && !this.hasNext()) return;

    const pageToLoad = isFirstPage ? 1 : this.page() + 1;

    if (isFirstPage) this.todoStore.clearSidebarLists();

    this.isLoadingLists.set(true);

    let request;

    if (this.isSearching())
      request = this.todoListService.searchSidebarLists(
        this.searchModel().search.trim(),
        { page: pageToLoad, pageSize: this.pageSize });
    else
      request = this.todoListService.getUserSidebarLists(
        { page: pageToLoad, pageSize: this.pageSize });

    request.subscribe({
      next: response => {
        this.todoStore.appendSidebarLists(response.items);

        this.page.set(response.page);
        this.totalCount.set(response.totalCount);
        this.totalPages.set(response.totalPages);
        this.hasNext.set(response.hasNextPage);
        this.hasPrevious.set(response.hasPreviousPage);

        if (this.todoStore.selectedListId() === null) {
          this.todoStore.selectListId(this.myDaySidebarList().id);
          this.todoStore.selectListType(ToDoListType.MyDay)
        }

        this.isLoadingLists.set(false);
      },
      error: error => {
        this.isLoadingLists.set(false);
        this.onActionError(error.error as ErrorResponse);
      }
    });
  };

  loadMyDayCountItems(): void {
    this.todoItemService.getMyDayCountItems().subscribe({
      next: response => {
        this.todoStore.setMyDayListCountItems(response);
      },
      error: error => {
        this.onActionError(error.error as ErrorResponse);
      }
    })
  }

  loadImportantCountItems(): void {
    this.todoItemService.getImportantCountItems().subscribe({
      next: response => {
        this.todoStore.setImportantListCountItems(response);
      },
      error: error => {
        this.onActionError(error.error as ErrorResponse);
      }
    })
  }

  loadTaskCountItems(): void {
    this.todoItemService.getTaskCountItems().subscribe({
      next: response => {
        this.todoStore.setTaskListCountItems(response);
      },
      error: error => {
        this.onActionError(error.error as ErrorResponse);
      }
    })
  }

  onSidebarScroll(event: Event): void {
    const container = event.target as HTMLLIElement;

    if (container.scrollTop === 0) {
      return;
    }

    if (container.scrollHeight <= container.clientHeight) {
      return;
    }

    const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 2;

    if (!isAtBottom)
      return;

    this.loadLists(false);
  }

  onUserExitButtonClick() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  };

  onCreateListSubmit(model: CreateToDoSidebarListModel): void {
    const request: CreateToDoListRequest = {
      title: model.title,
      description: null
    };

    this.todoListService.createList(request).subscribe({
      next: () => {
        this.loadLists(true);
        this.isCreateSidebarList.set(false);
      },
      error: error => {
        this.onCreateListCancel();
        this.onActionError(error.error as ErrorResponse)
      }
    })
  }

  onCreateListCancel(): void {
    this.isCreateSidebarList.set(false);
  }

  onSearchList(event: Event): void {
    event.preventDefault();

    if (this.searchForm().invalid())
      return;

    this.isSearching.set(true);
    this.todoStore.clearSidebarLists();
    this.loadLists(true);
  }

  onClearSearchList(): void {
    this.searchModel.set({ search: '' });
    this.isSearching.set(false);
    this.todoStore.clearSidebarLists();
    this.loadLists(true);
  }

  onActionError(errorResponse: ErrorResponse): void {
    this.statusNotification.set({
      type: 'error',
      message: errorResponse.Message,
      errors: errorResponse.Errors,
    });
  }
}
