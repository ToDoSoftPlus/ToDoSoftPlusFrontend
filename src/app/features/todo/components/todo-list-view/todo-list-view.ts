import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { TodoItemList } from '../todo-item-list/todo-item-list';
import { ToDoList, UpdateToDoListRequest } from '../../../../core/models/todos/todo-list/todo-list.model';
import { TodoListService } from '../../../../core/services/todo-list';
import { form, maxLength, minLength, required, FormField } from '@angular/forms/signals';
import { ErrorResponse } from '../../../../core/models/common/error-response.model';

@Component({
  selector: 'app-todo-list-view',
  imports: [TodoItemList, FormField],
  templateUrl: './todo-list-view.html',
  styleUrl: './todo-list-view.scss',
})
export class TodoListView {
  toDoListId = input.required<number>();

  onListDelete = output<void>();
  onListEdit = output<ToDoList>();
  onListEditError = output<ErrorResponse>();

  toDoListService = inject(TodoListService);

  toDoList = signal<ToDoList | undefined>(undefined);
  isEditList = signal<boolean>(false);
  editListModel = signal<UpdateToDoListRequest>({
    id: 0,
    title: '',
    description: ''
  });

  editListForm = form(this.editListModel, (schema) => {
    required(schema.title);
    minLength(schema.title, 3);
    maxLength(schema.title, 100);
  });

  constructor() {
    effect(() => {
      const listId = this.toDoListId();
      this.loadList(listId);
    })
  }

  loadList(listId: number): void {
    this.toDoListService.getListById(listId).subscribe({
      next: response => {
        this.toDoList.set(response);

        this.editListModel.set({
          id: response.id,
          title: response.title,
          description: response.description ?? ""
        });
      }
    })
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

        this.onListEdit.emit(response);
      },
      error: error => {
        const errorResponse = error.error as ErrorResponse;
        console.log(error);
        
        this.onListEditError.emit(errorResponse);
      }
    })
  }

  onListEditCancel(): void {
    this.isEditList.set(false);
  }
}
