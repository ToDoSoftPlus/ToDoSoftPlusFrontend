import { Component, output, signal } from '@angular/core';
import { CreateToDoSidebarListModel } from '../../models/create-todo-sidebar-list.model';
import { form, maxLength, minLength, required, FormField } from '@angular/forms/signals';
import { AutofocusDirective } from "../../../../shared/directives/auto-focus.derective";

@Component({
  selector: 'app-create-todo-sidebar-list',
  imports: [FormField, AutofocusDirective],
  templateUrl: './create-todo-sidebar-list.html',
  styleUrl: './create-todo-sidebar-list.scss',
})
export class CreateToDoSidebarList {

  onSubmit = output<CreateToDoSidebarListModel>();
  onCancel = output<void>();

  createSidebarListModel = signal<CreateToDoSidebarListModel>({
    title: ''
  });

  createSidebarListForm = form(this.createSidebarListModel, (schema) => {
    required(schema.title, { message: "title is required" });
    minLength(schema.title, 3, { message: "title must be at least 3 characters" });
    maxLength(schema.title, 100, { message: "title must be smaller than 100 characters" });
  });

  onSubmitForm(event: Event): void {
    event.preventDefault();
    if (this.createSidebarListForm().invalid()) {
      return;
    }

    this.onSubmit.emit({
      title: this.createSidebarListModel().title.trim()
    });
  }
}
