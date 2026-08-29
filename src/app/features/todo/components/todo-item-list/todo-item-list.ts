import { Component, effect, inject, input } from '@angular/core';
import { ToDoItem } from '../../../../core/models/todos/todo-item/todo-item.model';
import { TodoStore } from '../../../../core/stores/todo.store';

@Component({
  selector: 'app-todo-item-list',
  imports: [],
  templateUrl: './todo-item-list.html',
  styleUrl: './todo-item-list.scss',
})
export class TodoItemList {
  toDoItem = input.required<ToDoItem>();

  todoStore = inject(TodoStore);

  onItemClick(): void {
    if (this.todoStore.selectedItem() === null) {
      this.todoStore.selectItem(this.toDoItem())
    } else if (this.todoStore.selectedItem()?.id !== this.toDoItem().id) {      
      this.todoStore.selectItem(this.toDoItem())
    }
    else {
      this.todoStore.clearItem();
    }
  }
}
