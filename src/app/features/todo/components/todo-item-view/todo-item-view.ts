import { Component, effect, inject, model, OnInit, signal } from '@angular/core';
import { TodoStore } from '../../../../core/stores/todo.store';
import { ToDoItem, UpdateToDoItemRequest } from '../../../../core/models/todos/todo-item/todo-item.model';
import { form, FormField } from '@angular/forms/signals';
import { TodoItemService } from '../../../../core/services/todo-item';
import { DatePipe } from '@angular/common';
import { CreateToDoSubItemRequest, ToDoSubItem, UpdateToDoSubItemRequest } from '../../../../core/models/todos/tood-sub-item/todo-sub-item.model';
import { TodoSubItemService } from '../../../../core/services/todo-sub-item';
import { AutofocusDirective } from '../../../../shared/directives/auto-focus.derective';

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

  todoItemModel = signal<UpdateToDoItemRequest>({
    id: 0,
    title: '',
    description: '',
    completedAt: null,
    isCompleted: false,
    isImportant: false,
    toDoListId: 0
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

  });

  editingSubItemId = signal<number | null>(null);
  editingSubItemModel = signal<UpdateToDoSubItemRequest>({
    id: 0,
    description: '',
    isCompleted: false,
    toDoItemId: 0
  });
  editingSubItemForm = form(this.editingSubItemModel, (schema) => {

  });

  constructor() {
    effect(() => {
      const item = this.todoStore.selectedItem();

      if (item === null)
        return

      this.todoItemModel.set({
        id: item.id,
        title: item.title,
        description: item.description ?? '',
        completedAt: null,
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

    this.todoItemService.updateItem(this.todoItemModel()).subscribe({
      next: response => {
        this.todoStore.notifyItemChanged(response);
      }
    })
  }

  onDeleteItem(): void {
    const item = this.todoStore.selectedItem();

    if (item === null)
      return

    this.todoItemService.deleteItem(item.id).subscribe({
      next: () => {
        this.todoStore.notifyItemDeleted();
        this.todoStore.decrementItemCount(item.toDoListId);
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

  onDeleteSubItem(subItemId: number): void {
    this.todoSubItemService.deleteSubItem(subItemId).subscribe({
      next: () => {
        this.todoSubItemsModel.update(model => model.filter(subItem => subItem.id !== subItemId));
      }
    });
  }

  onSubItemTitleChanged(id: number, title: string): void {
    this.todoSubItemsModel.update(model => model.map(subItem => subItem.id === id ? { ...subItem, title } : subItem));
  }

  onSubItemCompletedChanged(id: number, isCompleted: boolean): void {
    this.todoSubItemsModel.update(model => model.map(subItem => subItem.id === id ? { ...subItem, isCompleted } : subItem));
  }
}
