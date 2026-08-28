import { Component, effect, inject, model, OnInit, signal } from '@angular/core';
import { TodoStore } from '../../../../core/stores/todo.store';
import { ToDoItem, UpdateToDoItemRequest } from '../../../../core/models/todos/todo-item/todo-item.model';
import { form, FormField, required } from '@angular/forms/signals';
import { TodoItemService } from '../../../../core/services/todo-item';
import { DatePipe, NgPlural } from '@angular/common';
import { CreateToDoSubItemRequest, ToDoSubItem, UpdateToDoSubItemRequest } from '../../../../core/models/todos/tood-sub-item/todo-sub-item.model';
import { TodoSubItemService } from '../../../../core/services/todo-sub-item';
import { AutofocusDirective } from '../../../../shared/directives/auto-focus.derective';
import { ToDoListType } from '../../../../core/models/todos/todo-list/todo-list.model';

@Component({
  selector: 'app-todo-item-view',
  imports: [FormField, DatePipe, AutofocusDirective],
  templateUrl: './todo-item-view.html',
  styleUrl: './todo-item-view.scss',
})
export class TodoItemView {
  todoStore = inject(TodoStore);
  todoItemService = inject(TodoItemService);
  todoSubItemService = inject(TodoSubItemService);

  todoItemOriginal: ToDoItem | null = null;
  todoItemModel = signal<UpdateToDoItemRequest>({
    id: 0,
    title: '',
    description: '',
    completedAt: null,
    isMyDay: false,
    isCompleted: false,
    isImportant: false,
    toDoListId: null
  });
  todoItemForm = form(this.todoItemModel, (schema) => {

  });

  todoSubItemsModel = signal<ToDoSubItem[]>([]);

  isCreatingSubItem = signal<boolean>(false);
  creatingSubItemModel = signal<CreateToDoSubItemRequest>({
    description: '',
    isCompleted: false,
    toDoItemId: 0
  });
  creatingSubItemForm = form(this.creatingSubItemModel, (schema) => {
    required(schema.description)
  });

  editingSubItemId = signal<number | null>(null);
  editingSubItemModel = signal<UpdateToDoSubItemRequest>({
    id: 0,
    description: '',
    isCompleted: false,
    toDoItemId: 0
  });
  editingSubItemForm = form(this.editingSubItemModel, (schema) => {
    required(schema.description)
  });

  constructor() {
    effect(() => {
      const item = this.todoStore.selectedItem();

      if (item === null)
        return

      this, this.todoItemOriginal = item;
      this.todoItemModel.set({
        id: item.id,
        title: item.title,
        description: item.description ?? '',
        completedAt: null,
        isMyDay: item.isMyDay,
        isCompleted: item.isCompleted,
        isImportant: item.isImportant,
        toDoListId: item.toDoListId
      });

      this.loadSubItems();

      this.creatingSubItemModel.update(model => ({
        ...model,
        toDoItemId: item.id
      }));
    })
  }

  loadSubItems(): void {
    const item = this.todoStore.selectedItem();

    if (item === null)
      return

    this.todoSubItemService.getSubItemsInItem(item.id).subscribe({
      next: response => {
        this.todoSubItemsModel.set(response);
      }
    })
  }

  onFormSubmit(event: Event): void {
    event.preventDefault();

    if (this.todoItemForm().invalid())
      return;

    const listType = this.todoStore.selectedListType();

    if (!listType)
      return;

    this.todoItemService.updateItem(this.todoItemModel()).subscribe({
      next: response => {
        this.todoStore.notifyItemChanged(response);

        if (this.todoItemOriginal?.isMyDay != this.todoItemModel().isMyDay)
          this.todoItemModel().isMyDay ?
            this.todoStore.incrementMyDayListItemCount() :
            this.todoStore.decrementMyDayListItemCount()

        if (this.todoItemOriginal?.isImportant != this.todoItemModel().isImportant)
          this.todoItemModel().isImportant ?
            this.todoStore.incrementImportantListItemCount() :
            this.todoStore.decrementImportantListItemCount()
      }
    })
  }

  onDeleteItem(): void {
    const item = this.todoStore.selectedItem();
    const listType = this.todoStore.selectedListType();

    if (item === null || listType === null)
      return

    this.todoItemService.deleteItem(item.id).subscribe({
      next: () => {
        this.todoStore.notifyItemDeleted();

        if (item.isMyDay)
          this.todoStore.decrementMyDayListItemCount();

        if (item.isImportant)
          this.todoStore.decrementImportantListItemCount();

        if (item.toDoListId)
          this.todoStore.decrementSidebarItemCount(item.toDoListId);
        else
          this.todoStore.decrementTaskListItemCount();
      }
    })
  }

  onCreateSubItem(event: Event): void {
    event.preventDefault();

    if (this.creatingSubItemForm().invalid())
      return;

    this.todoSubItemService.createSubItem(this.creatingSubItemModel()).subscribe({
      next: () => {
        this.isCreatingSubItem.set(false);
        this.creatingSubItemModel.update(model => ({
          ...model,
          description: '',
          isCompleted: false
        }));
        this.loadSubItems();
      }
    })
  }

  onEditSubItem(event: Event) {
    event.preventDefault();

    if (this.editingSubItemForm().invalid())
      return;

    this.todoSubItemService.updateSubItem(this.editingSubItemModel()).subscribe({
      next: response => {
        this.editingSubItemId.set(null);
        this.editingSubItemModel.set({
          id: 0,
          description: '',
          isCompleted: false,
          toDoItemId: 0
        });
        this.todoSubItemsModel.update(model => model.map(subItem => subItem.id === response.id ? response : subItem));
      }
    })
  }

  onEditSubItemButtonClick(subItem: ToDoSubItem) {
    this.editingSubItemId.set(subItem.id);
    this.editingSubItemModel.set({
      id: subItem.id,
      description: subItem.description,
      isCompleted: subItem.isCompleted,
      toDoItemId: subItem.toDoItemId
    });
  }

  onCancelEditSubItemButtonClick(): void {
    this.editingSubItemId.set(null);
    this.editingSubItemModel.set({
      id: 0,
      description: '',
      isCompleted: false,
      toDoItemId: 0
    });
  }

  onDeleteSubItem(subItemId: number): void {
    this.todoSubItemService.deleteSubItem(subItemId).subscribe({
      next: () => {
        this.todoSubItemsModel.update(model => model.filter(subItem => subItem.id !== subItemId));
      }
    });
  }
}
