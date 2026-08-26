import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { TodoItemList } from '../todo-item-list/todo-item-list';
import { ToDoList, UpdateToDoListRequest } from '../../../../core/models/todos/todo-list/todo-list.model';
import { TodoListService } from '../../../../core/services/todo-list';
import { form, maxLength, minLength, required, FormField } from '@angular/forms/signals';
import { ErrorResponse } from '../../../../core/models/common/error-response.model';
import { TodoItemService } from '../../../../core/services/todo-item';
import { CreateToDoItemRequest, ToDoItem } from '../../../../core/models/todos/todo-item/todo-item.model';
import { PagedResponse } from '../../../../core/models/common/paged-response.model';
import { TodoStore } from '../../../../core/stores/todo.store';
import { ToDoSidebarList } from '../../models/todo-sidebar-list.model';

@Component({
  selector: 'app-todo-list-view',
  imports: [TodoItemList, FormField],
  templateUrl: './todo-list-view.html',
  styleUrl: './todo-list-view.scss',
})
export class TodoListView {
  onActionError = output<ErrorResponse>();

  toDoListService = inject(TodoListService);
  toDoItemService = inject(TodoItemService);
  todoStore = inject(TodoStore);

  toDoList = signal<ToDoList | undefined>(undefined);
  toDoItems = signal<PagedResponse<ToDoItem> | undefined>(undefined);

  page = signal<number>(1);
  private pageSize = 7;

  isEditList = signal<boolean>(false);
  editListModel = signal<UpdateToDoListRequest>({
    id: 0,
    title: '',
    description: ''
  });

  createItemModel = signal<CreateToDoItemRequest>({
    title: '',
    description: '',
    isCompleted: false,
    isImportant: false,
    toDoListId: 0,
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
      const listId = this.todoStore.selectedListId();
      this.loadList(listId);
      this.loadListItems(listId);
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

  loadListItems(listId: number | null): void {
    if (listId === null)
      return;

    this.toDoItemService.getItemsInList(listId, {page: this.page(), pageSize: this.pageSize}).subscribe({
      next: response => {
        this.toDoItems.set(response);
      },
      error: error => {
        const errorResponse = error.error as ErrorResponse;
        this.onActionError.emit(errorResponse);
      }
    });
  }

  onListEditButtonClick(): void {
    this.isEditList.set(true);
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

        this.todoStore.updateSidebarTitleList(response.id, response.title);
        this.todoStore.notifyListChanged();
      },
      error: error => {
        const errorResponse = error.error as ErrorResponse;
        this.onActionError.emit(errorResponse);
      }
    })
  }

  onListEditCancel(): void {
    this.isEditList.set(false);
  }

  onListDeleteButtonClick(): void {
    const listId = this.todoStore.selectedListId();
    if (listId === null)
      return;

    this.toDoListService.deleteList(listId).subscribe({
      next: () => {
        this.todoStore.selectListId(null);
        this.todoStore.notifyListChanged();
      }
    })
  }

  onItemCreateSubmit(event: Event): void {
    event.preventDefault();

    if (this.createItemForm().invalid()) {
      return;
    }

    this.toDoItemService.createItem(this.createItemModel()).subscribe({
      next: response => {
        this.loadListItems(response.toDoListId);
        this.todoStore.incrementItemCount(response.toDoListId);
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
}
