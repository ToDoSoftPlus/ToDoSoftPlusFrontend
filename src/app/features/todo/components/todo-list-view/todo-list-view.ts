import { Component, effect, inject, input, OnInit, output, signal, untracked } from '@angular/core';
import { TodoItemList } from '../todo-item-list/todo-item-list';
import { ToDoList, ToDoListType, UpdateToDoListRequest } from '../../../../core/models/todos/todo-list/todo-list.model';
import { TodoListService } from '../../../../core/services/todo-list';
import { form, maxLength, minLength, required, FormField } from '@angular/forms/signals';
import { ErrorResponse } from '../../../../core/models/common/error-response.model';
import { TodoItemService } from '../../../../core/services/todo-item';
import { CreateToDoItemRequest, ToDoItem } from '../../../../core/models/todos/todo-item/todo-item.model';
import { TodoStore } from '../../../../core/stores/todo.store';
import { Pagination } from '../../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-todo-list-view',
  imports: [TodoItemList, FormField, Pagination],
  templateUrl: './todo-list-view.html',
  styleUrl: './todo-list-view.scss',
})
export class TodoListView {
  onActionError = output<ErrorResponse>();

  toDoListService = inject(TodoListService);
  toDoItemService = inject(TodoItemService);
  toDoStore = inject(TodoStore);

  toDoList = signal<ToDoList | undefined>(undefined);
  systemListTitle = signal<string>('');
  toDoItems = signal<ToDoItem[]>([]);

  page = signal<number>(1);
  pageSize = 6;
  totalCount = signal(0);
  totalPages = signal(0);
  hasNext = signal(false);
  hasPrevious = signal(false);

  isEditList = signal<boolean>(false);
  editListModel = signal<UpdateToDoListRequest>({
    id: 0,
    title: '',
    description: ''
  });

  createItemModel = signal<CreateToDoItemRequest>({
    title: '',
    description: '',
    isMyDay: false,
    isCompleted: false,
    isImportant: false,
    toDoListId: null,
    completedAt: null
  })

  createItemForm = form(this.createItemModel, (schema) => {
    required(schema.title);
    maxLength(schema.title, 100);
  })

  editListForm = form(this.editListModel, (schema) => {
    required(schema.title);
    minLength(schema.title, 3);
    maxLength(schema.title, 100);
  });

  constructor() {
    effect(() => {
      const listId = this.toDoStore.selectedListId();
      const listType = this.toDoStore.selectedListType();

      if (!listId || !listType) {
        return;
      }

      if (listType === ToDoListType.Regular) {
        this.loadList(listId);
      }
      else {
        this.systemListTitle.set(listType);
        this.toDoList.set(undefined);
      }

      this.loadListItems(listId, this.page(), listType);
    })

    effect(() => {
      const changedItem = this.toDoStore.itemUpdated();

      if (!changedItem) {
        return;
      }

      this.toDoItems.update(items => items.map(item => item.id === changedItem.id ? changedItem : item));
    })

    effect(() => {
      const itemDeleted = this.toDoStore.itemDeleted();

      if (!itemDeleted) {
        return;
      }

      this.loadListItems(this.toDoStore.selectedListId(), this.page(), this.toDoStore.selectedListType()!);
    })
  }

  loadList(listId: number | null): void {
    if (listId === null)
      return;

    this.toDoListService.getListById(listId).subscribe({
      next: response => {
        this.toDoList.set(response);

        this.editListModel.set({
          id: response.id,
          title: response.title,
          description: response.description ?? ""
        });

        this.createItemModel.update(model => {
          if (!model)
            return model

          return {
            ...model,
            toDoListId: response.id
          };
        })
      }
    })
  }

  loadListItems(listId: number | null, page: number, listType: ToDoListType): void {
    let request;

    switch (listType) {
      case ToDoListType.MyDay:
        request = this.toDoItemService.getMyDayItems({ page: page, pageSize: this.pageSize });
        break;
      case ToDoListType.Important:
        request = this.toDoItemService.getImportantItems({ page: page, pageSize: this.pageSize });
        break;
      case ToDoListType.Task:
        request = this.toDoItemService.getTaskItems({ page: page, pageSize: this.pageSize });
        break;
      case ToDoListType.Regular:
        request = this.toDoItemService.getItemsInList(listId!, { page: page, pageSize: this.pageSize });
        break;
    }

    request.subscribe({
      next: response => {
        this.toDoItems.set(response.items);
        this.page.set(response.page);
        this.totalCount.set(response.totalCount);
        this.totalPages.set(response.totalPages);
        this.hasNext.set(response.hasNextPage);
        this.hasPrevious.set(response.hasPreviousPage);
      },
      error: error => {
        const errorResponse = error.error as ErrorResponse;
        this.onActionError.emit(errorResponse);
      }
    });
  }

  onListEditButtonClick(): void {
    const list = this.toDoList();

    if (list === undefined)
      return;

    this.isEditList.set(true);
    this.editListModel.set({
      id: list.id,
      title: list.title,
      description: list.description ?? ''
    });
  }

  onListEditSubmit(event: Event): void {
    event.preventDefault();

    if (this.editListForm().invalid()) {
      return;
    }

    this.toDoListService.updateList(this.editListModel()).subscribe({
      next: response => {
        this.toDoList.set(response);

        this.editListModel.set({
          id: response.id,
          title: response.title,
          description: response.description ?? ""
        });

        this.isEditList.set(false);

        this.toDoStore.updateSidebarTitleList(response.id, response.title);
        this.toDoStore.notifyListChanged();
      },
      error: error => {
        const errorResponse = error.error as ErrorResponse;
        this.onActionError.emit(errorResponse);
      }
    })
  }

  onListEditCancel(): void {
    this.isEditList.set(false);
    this.editListModel.set({
      id: 0,
      title: '',
      description: ''
    });
  }

  onListDeleteButtonClick(): void {
    const listId = this.toDoStore.selectedListId();
    if (listId === null)
      return;

    this.toDoListService.deleteList(listId).subscribe({
      next: () => {
        this.toDoStore.selectListId(null);
        this.toDoStore.notifyListChanged();
      }
    })
  }

  onItemCreateSubmit(event: Event): void {
    event.preventDefault();

    if (this.createItemForm().invalid()) {
      return;
    }

    const listType = this.toDoStore.selectedListType()

    if (!listType) return;

    switch (listType) {
      case ToDoListType.MyDay:
        this.createItemModel.update(model => ({ ...model, IsMyDay: true, toDoListId: null }))
        break;
      case ToDoListType.Important:
        this.createItemModel.update(model => ({ ...model, isImportant: true, toDoListId: null }))
        break;
      case ToDoListType.Task:
        this.createItemModel.update(model => ({ ...model, toDoListId: null }))
        break;
    }

    this.toDoItemService.createItem(this.createItemModel()).subscribe({
      next: response => {
        this.loadListItems(response.toDoListId, this.page(), listType);
        switch (listType) {
          case ToDoListType.MyDay:
            this.toDoStore.incrementMyDayListItemCount();
            this.toDoStore.incrementTaskListItemCount();
            break;
          case ToDoListType.Important:
            this.toDoStore.incrementImportantListItemCount();
            this.toDoStore.incrementTaskListItemCount();
            break;
          case ToDoListType.Task: this.toDoStore.incrementTaskListItemCount(); break;
          case ToDoListType.Regular: this.toDoStore.incrementSidebarItemCount(response.toDoListId!); break;
        }
      },
      error: error => {
        const errorResponse = error.error as ErrorResponse;
        this.onActionError.emit(errorResponse);
      }
    })

    this.onItemCreateClear();
  }

  onItemCreateClear(): void {
    this.createItemModel.update(model => {
      if (!model)
        return model;

      return {
        ...model,
        title: '',
        description: '',
        isCompleted: false,
        isImportant: false,
        completedAt: null
      }
    })
  }

  IsListTypeReqular(): boolean {
    return this.toDoStore.selectedListType() === ToDoListType.Regular;
  }
}
