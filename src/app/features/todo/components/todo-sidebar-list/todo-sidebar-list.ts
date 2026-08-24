import { Component, effect, ElementRef, Input, input, inputBinding, output, signal, viewChild } from '@angular/core';
import { ToDoSidebarList } from '../../models/todo-sidebar-list.model';
import { form } from '@angular/forms/signals';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-sidebar-list',
  imports: [ReactiveFormsModule],
  templateUrl: './todo-sidebar-list.html',
  styleUrl: './todo-sidebar-list.scss',
})
export class TodoSidebarList {
  toDoSidebarList = input.required<ToDoSidebarList>();
  isEditing = input<boolean>(false);

  OnEdit = output<string>();
  OnEditCancel = output<void>();
  
  titleInput = viewChild<ElementRef<HTMLInputElement>>('titleInput');

  form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(3),
        Validators.max(100)
      ]
    })
  });

  constructor() {
    effect(() => {
      if (this.isEditing()) {
        this.form.controls.title.setValue(
          this.toDoSidebarList().title
        );

        setTimeout(() => {
          this.titleInput()?.nativeElement.focus();
        });
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    this.OnEdit.emit(
      this.form.controls.title.value.trim()
    );
  }
}
