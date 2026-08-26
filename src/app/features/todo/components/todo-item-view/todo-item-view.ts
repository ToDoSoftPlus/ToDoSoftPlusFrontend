import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { TodoStore } from '../../../../core/stores/todo.store';
import { ToDoItem, UpdateToDoItemRequest } from '../../../../core/models/todos/todo-item/todo-item.model';
import { form, FormField } from '@angular/forms/signals';
import { TodoItemService } from '../../../../core/services/todo-item';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-todo-item-view',
  imports: [FormField, DatePipe],
  templateUrl: './todo-item-view.html',
  styleUrl: './todo-item-view.scss',
})
export class TodoItemView {
  todoStore = inject(TodoStore);
  todoItemService = inject(TodoItemService);

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

  onDelete(): void {
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
}
